<template>
  <v-layout column>
    {{JSON.stringify(this.fetchedUser.love_list)}}
    {{ this.fetchedUser.username }}
    <v-layout row wrap id="top_buttons">
      <v-flex xs5>
        <v-select label="Sort By" :items="sort_by_items" v-model="sort_by"></v-select>
      </v-flex>
      <v-flex xs7>
        <v-text-field
            prepend-icon="search"
            append-icon="mic"
            label="Search"
            solo-inverted
            flat
          ></v-text-field>
      </v-flex>
    </v-layout>
    <v-card
      v-for="card in cards"
      class="mb-2"
      light
      style="border-radius: 20px; background-color: rgba(255, 255, 255, 0.0); position:relative"
      >
        <img
          style="position:absolute; bottom:0; height: 230px; z-index: 2; right: 0px; left: 0px; margin: 0 auto;"
          :src="card.character"
          />
          <div style="position:absolute; bottom:0; height: 50px; width: 100%; z-index: 1; background-color: #ffffff; border-bottom-right-radius: 20px; border-bottom-left-radius: 20px;">
          </div>
      <v-card-media
        height="180px"
      >
      <div v-ripple class="novel-text main-gradient" style="opacity: 0.5; height: 100%; padding-top: 60px; width: 100%; position: absolute; z-index: 2; text-align: center; color: #ffffff; border-top-left-radius: 20px; border-top-right-radius: 20px;">
        <div style="font-size: 24px;">{{card.title}}</div>
        <div style="font-size: 21px;">by <i>{{card.author}}</i></div>
      </div>
      <img
        style="z-index: 1; border-top-left-radius: 20px; border-top-right-radius: 20px;"
        v-blur="blurConfig"
        :src="card.background"
        />
      </v-card-media>
      <v-card-actions style="background-color: rgba(255, 255, 255, 0.8); z-index: 3; position: relative;">
        <v-btn icon light @click='toggleLove(card)'>
          <v-icon v-if="card.love" color="red">favorite</v-icon>
          <v-icon v-else color="grey">favorite</v-icon>
        </v-btn>
        <span  style="color: #9E9E9E">{{card.love_count}}</span>
        <v-spacer></v-spacer>
        <v-btn icon light @click='toggleFavourite(card)'>
          <v-icon v-if="card.bookmark" color="yellow">bookmark</v-icon>
          <v-icon v-else color="grey">bookmark</v-icon>
        </v-btn>
        <v-btn icon light>
          <v-icon color="grey">share</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-layout>
</template>

<script>
import Cookies from 'js-cookie'
import $ from 'jquery'
export default {
  middleware: 'authenticated',
  data () {
    return {
      love_list: this.$store.state.user.love_list,
      fetchedUser: this.$store.state.fetchedUser,
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
      cards: [
        {
          id: "1",
          title: "Death Grips: Meet the President",
          author: "oppai_suika",
          love: false,
          love_count: 15,
          bookmark: false,
          character: "https://vignette.wikia.nocookie.net/doki-doki-literature-club/images/c/c3/Yuri_school_3.png/revision/latest?cb=20171112095331",
          background: "https://img00.deviantart.net/afda/i/2017/112/4/b/luxury_office_day___visual_novel_background_by_giaonp-db6m8h1.jpg"
        },
        {
          id: "2",
          title: "Ace Attorney",
          author: "dat boi",
          love: false,
          love_count: 4,
          bookmark: false,
          character: "https://pre00.deviantart.net/057c/th/pre/f/2016/187/c/8/phoenix_wright___ace_attorney___by_sideboffstage-da8yiiv.png",
          background: "https://vignette.wikia.nocookie.net/aceattorney/images/e/ed/Bombed_Courtroom.png/revision/latest?cb=20130427194539"
        },
        {
          id: "3",
          title: "Ace Attorney",
          author: "dat boi",
          love: false,
          love_count: 4,
          bookmark: false,
          character: "https://78.media.tumblr.com/85ec5afcc7826b894e1d6fde81e97678/tumblr_inline_mir5owqZJg1qz4rgp.gif",
          background: "https://vignette.wikia.nocookie.net/aceattorney/images/7/75/English_courtroom_lobby.png"
        },
        {
          id: "4",
          title: "Ace Attorney",
          author: "dat boi",
          love: false,
          love_count: 4,
          bookmark: false,
          character: "https://pre00.deviantart.net/057c/th/pre/f/2016/187/c/8/phoenix_wright___ace_attorney___by_sideboffstage-da8yiiv.png",
          background: "https://vignette.wikia.nocookie.net/aceattorney/images/e/ed/Bombed_Courtroom.png/revision/latest?cb=20130427194539"
        }
      ]
    }
  },
  fetch ({ store, params, req }) {
    const username = params.username
    console.log("username " + username)
    const token = process.SERVER_BUILD ? req.cookies.token : Cookies.get('token')
    return store.dispatch('fetchedUser/fetchUser', { username, token })
  },
  mounted: () => {
  },
  methods: {
    handleScroll () {
      $(".card").each(function(index) {
        var toolbar_height = $(".toolbar").eq(0).outerHeight()
        //var top_buttons_height = $("#top_buttons").eq(0).outerHeight()
        var top_of_element = $(this).offset().top - toolbar_height// - top_buttons_height;
        var bottom_of_element = $(this).offset().top + $(this).outerHeight() - toolbar_height// - top_buttons_height;
        var bottom_of_screen = $(window).scrollTop() + window.innerHeight;
        var top_of_screen = $(window).scrollTop();

        if((bottom_of_screen > bottom_of_element) && (top_of_screen < top_of_element)){
          $(this).find(".novel-text").fadeIn();
          // The element is visible, do something
          /*if (index == 2) {
            console.log("its in" + bottom_of_screen + "," + top_of_element + "," + top_of_screen + "," + bottom_of_element + "," + $(".toolbar").eq(0).outerHeight())
          }*/
        }
        else {
          $(this).find(".novel-text").fadeOut();
        }
      });
    },
    toggleLove: function(card) {
      card.love = !card.love;
      if (card.love) {
        card.love_count++;
      } else {
        card.love_count--;
      }
      this.love_update(card.id)
    },
    toggleFavourite: function(card) {
      card.bookmark = !card.bookmark;
    },
    love_update (id) {
      this.$store.dispatch('user/love', {
        username: this.$store.state.user.username,
        id: id
      })
    }
  },
  beforeMount () {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.handleScroll);
  }
}
</script>
