<template>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-card-media src="/static/doc-images/lists/ali.png" height="300px">
          <v-layout column class="media">
            <v-card-title>
              kjjkhjkh{{$store.state.title}}
              <v-btn dark icon>
                <v-icon>chevron_left</v-icon>
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn dark icon class="mr-3">
                <v-icon>edit</v-icon>
              </v-btn>
              <v-btn dark icon>
                <v-icon>more_vert</v-icon>
              </v-btn>
            </v-card-title>
            <v-spacer></v-spacer>
            <v-card-title class="white--text pl-5 pt-5">
              <div class="display-1 pl-5 pt-5">Ali Conners</div>
            </v-card-title>
          </v-layout>
        </v-card-media>
        <v-list two-line>
          <v-list-tile @click="">
            <v-list-tile-action>
              <v-icon color="indigo">phone</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>(650) 555-1234</v-list-tile-title>
              <v-list-tile-sub-title>Mobile</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon>chat</v-icon>
            </v-list-tile-action>
          </v-list-tile>
          <v-list-tile @click="">
            <v-list-tile-action></v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>(323) 555-6789</v-list-tile-title>
              <v-list-tile-sub-title>Work</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon>chat</v-icon>
            </v-list-tile-action>
          </v-list-tile>
          <v-divider inset></v-divider>
          <v-list-tile @click="">
            <v-list-tile-action>
              <v-icon color="indigo">mail</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>aliconnors@example.com</v-list-tile-title>
              <v-list-tile-sub-title>Personal</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click="">
            <v-list-tile-action></v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>ali_connors@example.com</v-list-tile-title>
              <v-list-tile-sub-title>Work</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider inset></v-divider>
          <v-list-tile @click="">
            <v-list-tile-action>
              <v-icon color="indigo">location_on</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>1400 Main Street</v-list-tile-title>
              <v-list-tile-sub-title>Orlando, FL 79938</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import Cookies from 'js-cookie'
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
      card: {
        id: "1",
        title: "Death Grips: Meet the President",
        author: "oppai_suika",
        love: false,
        love_count: 15,
        bookmark: false,
        character: "https://vignette.wikia.nocookie.net/doki-doki-literature-club/images/c/c3/Yuri_school_3.png/revision/latest?cb=20171112095331",
        background: "https://img00.deviantart.net/afda/i/2017/112/4/b/luxury_office_day___visual_novel_background_by_giaonp-db6m8h1.jpg"
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.$store.commit('SET_TITLE', "Info")
      this.$store.commit('SET_SHOW_TOOLBAR', false)
    }
  }
}
</script>
