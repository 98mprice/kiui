<template>
  <!--<v-container>-->
    <v-layout column>
      <v-layout row wrap id="top_buttons"  style="padding: 10px">
        <v-flex xs5>
          <v-select label="Sort By" :items="sort_by_items" v-model="sort_by"></v-select>
        </v-flex>
        <v-flex xs7>
          <v-text-field
              prepend-icon="search"
              append-icon="mic"
              label="Search"
              v-model="search_text"
              solo-inverted
              flat
            ></v-text-field>
        </v-flex>
      </v-layout>
      <v-progress-linear class="pt-0 mt-0" style="position: absolute;" v-show="searching" :indeterminate="true"></v-progress-linear>
      <v-card
        v-for="card in cards"
        class="mb-2"
        light
        style="border-radius: 20px; background-color: rgba(255, 255, 255, 0.0); position:relative; margin: 10px;"
        >
          <img
            style="position:absolute; bottom:0; height: 230px; z-index: 2; right: 0px; left: 0px; margin: 0 auto; border-radius: 0px;"
            :src="card.character"
            />
            <div style="position:absolute; bottom:0; height: 50px; width: 100%; z-index: 1; background-color: #ffffff; border-bottom-right-radius: 20px; border-bottom-left-radius: 20px;">
            </div>
        <v-card-media
          height="180px"
        >
        <div v-ripple @click="$router.push('/games/' + card.id)" class="novel-text main-gradient" style="opacity: 0.5; height: 100%; padding-top: 60px; width: 100%; position: absolute; z-index: 2; text-align: center; color: #ffffff; border-top-left-radius: 20px; border-top-right-radius: 20px;">
          <div style="font-size: 24px;">{{card.title}}</div>
          <div style="font-size: 21px;">by <i>{{card.username}}</i></div>
        </div>
        <img
          style="z-index: 1; border-top-left-radius: 20px; border-top-right-radius: 20px;"
          v-blur="blurConfig"
          :src="card.background"
          />
        </v-card-media>
        <v-card-actions style="background-color: rgba(255, 255, 255, 0.8); z-index: 3; position: relative;">
          <v-btn icon light @click='toggleLove(card)'>
            <v-icon v-if="user_info.love_list.indexOf(card.id) > -1" color="red">favorite</v-icon>
            <v-icon v-else color="grey">favorite</v-icon>
          </v-btn>
          <span  style="color: #9E9E9E">{{card.love_count}}</span>
          <v-spacer></v-spacer>
          <v-btn icon light @click='toggleFavourite(card)'>
            <v-icon v-if="user_info.bookmark_list.indexOf(card.id) > -1" color="yellow">bookmark</v-icon>
            <v-icon v-else color="grey">bookmark</v-icon>
          </v-btn>
          <v-btn icon light>
            <v-icon color="grey">share</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-layout>
  <!--</v-container>-->
</template>

<script>
import _ from 'lodash'
import axios from '~/plugins/axios'
import Cookies from 'js-cookie'
import $ from 'jquery'
export default {
  middleware: 'authenticated',
  data () {
    return {
      blurConfig: {
        isBlurred: true, // activate and deactivate blur directive example 2
        opacity: 1,
        filter: 'blur(1.3px)',
        transition: 'all .3s linear'
      },
      sort_by: 0,
      sort_by_items: [
        { text: 'Reccommended', value: 0 },
        { text: 'Top', value: 1 },
        { text: 'New', value: 2 }
      ],
      scrolled: false,
      searching: false,
      search_text: ''
    }
  },
  mounted () {
    this.init()
  },
  async asyncData({ store, params, error }) {
    var username = store.state.user.username
    let userRes = await axios.get(`/users/${username}`)
    let gameRes = await axios.get(`/games/`)
    if (!userRes) error({ statusCode: 404, message: 'User not found' })
    if (!gameRes) error({ statusCode: 404, message: 'Game not found' })
    return {
       user_info: userRes.data[0],
       cards: gameRes.data,
       initial_cards: gameRes.data
    }
  },
  watch: {
    search_text: function() {
      this.search_games()
    }
  },
  methods: {
    init() {
      this.$store.commit('SET_TITLE', "Play")
      this.$store.commit('SET_SHOW_TOOLBAR', true)
    },
    handleScroll () {
      $(".card").each(function(index) {
        var toolbar_height = $(".toolbar").eq(0).outerHeight()
        var top_of_element = $(this).offset().top - toolbar_height
        var bottom_of_element = $(this).offset().top + $(this).outerHeight() - toolbar_height
        var bottom_of_screen = $(window).scrollTop() + window.innerHeight;
        var top_of_screen = $(window).scrollTop();

        if((bottom_of_screen > bottom_of_element) && (top_of_screen < top_of_element)){
          $(this).find(".novel-text").fadeIn();
        } else {
          $(this).find(".novel-text").fadeOut();
        }
      });
    },
    toggleLove: function(card) {
      var love = true;
      if (this.user_info.love_list.indexOf(card.id) > -1) {
        love = false;
      }
      if (love) {
        card.love_count++;
        this.user_info.love_list.push(card.id)
      } else {
        var index = this.user_info.love_list.indexOf(card.id);
        if(index!=-1){
           this.user_info.love_list.splice(index, 1);
        }
        card.love_count--;
      }
      this.love_update(card, 'love')
    },
    toggleFavourite: function(card) {
      var love = true;
      if (this.user_info.favourite_list.indexOf(card.id) > -1) {
        love = false;
      }
      if (love) {
        this.user_info.favourite_list.push(card.id)
      } else {
        var index = this.user_info.favourite_list.indexOf(card.id);
        if(index!=-1){
           this.user_info.favourite_list.splice(index, 1);
        }
      }
      this.love_update(card, 'bookmark')
    },
    love_update (card, url) {
      console.log("sending love to url:" + '/games/' + JSON.stringify(card) + '/toggle_' + url + '/' + this.$store.state.user.username)
      axios.post('/games/' + card.id + '/toggle_' + url + '/' + this.$store.state.user.username)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    },
    search_games: _.debounce(async function() {
      if (this.search_text === "") {
        this.cards = this.initial_cards
        this.searching = false
      } else {
        console.log("searching for games")
        this.searching = true;
        let gameRes = await axios.get(`/games/search/${this.search_text}`)
        this.searching = false;
        this.cards = gameRes.data
      }
    }, 500)
  },
  beforeMount () {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.handleScroll);
  }
}
</script>
