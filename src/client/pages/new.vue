<template>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-card-media height="300px">
          <img v-blur="blurConfig" :src="card.background" style="height: 100%; width: 100%; transform: scale(1.2)"/>
          <img
            style="position:absolute; bottom:0; height: 80%; width: auto; z-index: 1; right: 0px; left: 0px; margin: 0 auto;"
            :src="card.character"
            />
          <span class="main-gradient" style="position: absolute; opacity: 0.5; height: 100%; width: 100%; z-index: 2"></span>
          <v-layout column class="media" style="z-index: 9; position: absolute; width: 100%; z-index: 8">
            <v-card-title>
              <v-btn dark icon @click="$router.go(-1)">
                <v-icon>chevron_left</v-icon>
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn icon dark @click='toggleLove(card)'>
                <v-icon v-if="love_list.indexOf(card.id) > -1" color="red">favorite</v-icon>
                <v-icon v-else>favorite</v-icon>
              </v-btn>
              <span dark>{{card.love_count}}</span>
              <v-btn icon dark @click='toggleFavourite(card)'>
                <v-icon v-if="favourite_list.indexOf(card.id) > -1" color="yellow">bookmark</v-icon>
                <v-icon v-else>bookmark</v-icon>
              </v-btn>
              <v-btn icon dark >
                <v-icon>share</v-icon>
              </v-btn>
            </v-card-title>
            <v-spacer></v-spacer>
            <v-card-title class="white--text pl-5 pt-5 pb-1">
              <div class="pb-1">
                <v-chip>
                  <v-avatar>
                    <img src="https://randomuser.me/api/portraits/men/35.jpg" alt="trevor">
                  </v-avatar>
                  {{card.author}}
                </v-chip>
              </div>
              <div class="display-1">{{card.title}}<span style="font-size: 16px" class="pl-2"><i> 80% complete</i></span></div>
            </v-card-title>
            <v-progress-linear height="2" color="white" class="pt-0 mt-0 mb-0" v-model="valueDeterminate"></v-progress-linear>
          </v-layout>
        </v-card-media>
        <v-card-text style="position: relative; z-index: 10" @click.stop="dialog2 = true">
          <v-btn
            absolute
            dark
            fab
            top
            right
            color="pink"
          >
            <v-icon>play_arrow</v-icon>
          </v-btn>
        </v-card-text>
        <div class="white--text pl-5 pt-1">
          <v-chip text-color="white" dark v-for="tag in card.tags" style="background-color: rgba(255, 255, 255, 0.1)">
           {{tag}}
          </v-chip>
        </div>
        <v-list two-line>
          <template v-for="(item, index) in items">
            <v-subheader v-if="item.header" :key="item.header">{{ item.header }}</v-subheader>
            <v-divider v-else-if="item.divider" :inset="item.inset" :key="index"></v-divider>
            <v-list-tile avatar v-else :key="item.title" @click="">
              <v-list-tile-avatar>
                <img :src="item.avatar">
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title v-html="item.title"></v-list-tile-title>
                <v-list-tile-sub-title v-html="item.subtitle"></v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </v-list>
      </v-card>
      <v-dialog v-model="dialog2" max-width="500px">
        <v-card>
          <v-card-title class="ma-0 pa-0">
            <v-spacer></v-spacer>
            <v-btn icon @click.stop="dialog2=false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="mt-0 pt-0">
            <v-btn block flat disabled dark>Continue</v-btn>
            <v-btn block flat dark>Start from beginning</v-btn>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-flex>
  </v-layout>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  middleware: 'authenticated',
  data () {
    return {
      items: [
          { header: 'Today' },
          { avatar: '/static/doc-images/lists/1.jpg', title: 'Brunch this weekend?', subtitle: "fsdds" },
          { divider: true, inset: true },
          { avatar: '/static/doc-images/lists/2.jpg', title: 'Summer BBQ', subtitle: "sdfdsds" },
          { divider: true, inset: true },
          { avatar: '/static/doc-images/lists/3.jpg', title: 'Oui oui', subtitle: "sdfdsfdsds" }
        ],
      valueDeterminate: 80,
      dialog2: false,
      chips: ['Programming', 'Playing video games', 'Watching', 'Sleeping'],
      love_list: [],
      favourite_list: [],
      blurConfig: {
        isBlurred: true, // activate and deactivate blur directive example 2
        opacity: 1,
        filter: 'blur(3px)',
        transition: 'all .3s linear'
      },
      card: {
        id: "1",
        title: "Death Grips: Meet the President",
        author: "oppai_suika",
        love: false,
        love_count: 15,
        bookmark: false,
        character: "https://vignette.wikia.nocookie.net/doki-doki-literature-club/images/c/c3/Yuri_school_3.png/revision/latest?cb=20171112095331",
        background: "https://img00.deviantart.net/afda/i/2017/112/4/b/luxury_office_day___visual_novel_background_by_giaonp-db6m8h1.jpg",
        tags: [
          'death grips',
          'kinetic novel',
          'short',
          'ace attorney',
          'pheonix wright'
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  created () {
    this.fetchData()
  },
  methods: {
    init() {
      this.$store.commit('SET_TITLE', "Info")
      this.$store.commit('SET_SHOW_TOOLBAR', false)
    },
    fetchData() {
      const token = process.SERVER_BUILD ? req.cookies.token : Cookies.get('token')
      this.$store.dispatch('fetchedUser/fetchLove', {
        username: this.$store.state.user.username,
        token: token
      }).then(() => {
        this.love_list = this.$store.state.fetchedUser.love_list.slice()
        this.favourite_list = this.$store.state.fetchedUser.bookmark_list.slice()
      })
    },
    created () {
      this.fetchData()
    },
    toggleLove: function(card) {
      var love = true;
      if (this.love_list.indexOf(card.id) > -1) {
        love = false;
      }
      if (love) {
        card.love_count++;
        this.love_list.push(card.id)
      } else {
        var index = this.love_list.indexOf(card.id);
        if(index!=-1){
           this.love_list.splice(index, 1);
        }
        card.love_count--;
      }
      this.love_update(card, 'love')
    },
    toggleFavourite: function(card) {
      var love = true;
      if (this.favourite_list.indexOf(card.id) > -1) {
        love = false;
      }
      if (love) {
        this.favourite_list.push(card.id)
      } else {
        var index = this.favourite_list.indexOf(card.id);
        if(index!=-1){
           this.favourite_list.splice(index, 1);
        }
      }
      this.love_update(card, 'bookmark')
    },
    love_update (card, url) {
      this.$store.dispatch('user/' + url, {
        username: this.$store.state.user.username,
        id: card.id,
        title: card.title
      })
    }
  }
}
</script>
