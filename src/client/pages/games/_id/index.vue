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
          <v-layout column class="media" style="height: 100%; z-index: 9; position: absolute; width: 100%; z-index: 8">
            <v-card-title>
              <v-btn dark icon @click="$router.go(-1)">
                <v-icon>chevron_left</v-icon>
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn icon dark @click='toggleLove(card)'>
                <v-icon v-if="user_info.love_list.indexOf(card.id) > -1" color="red">favorite</v-icon>
                <v-icon v-else>favorite</v-icon>
              </v-btn>
              <span dark>{{card.love_count}}</span>
              <v-btn icon dark @click='toggleFavourite(card)'>
                <v-icon v-if="user_info.bookmark_list.indexOf(card.id) > -1" color="yellow">bookmark</v-icon>
                <v-icon v-else>bookmark</v-icon>
              </v-btn>
              <v-btn icon dark >
                <v-icon>share</v-icon>
              </v-btn>
            </v-card-title>
            <v-spacer></v-spacer>
            <v-card-title class="white--text pl-5 pt-5 pb-1 pr-5">
              <div class="pb-1">
                <v-chip @click="$router.push('/users/' + card.username)">
                  <v-avatar>
                    <img src="https://randomuser.me/api/portraits/men/35.jpg" alt="trevor">
                  </v-avatar>
                  {{card.username}}
                </v-chip>
              </div>
              <div class="display-1" >{{card.title}}<span style="font-size: 16px" class="pl-2" v-if="started"><i> 80% complete</i></span></div>
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
        <v-list two-line class="mt-3 pb-0">
          <template v-for="(review, index) in reviews">
            <v-list-tile avatar :key="review.title" class="mb-2">
              <v-list-tile-avatar>
                <img :src="review.avatar">
              </v-list-tile-avatar>
              <v-list-tile-content dark style="background-color: white; border-radius: 5px;" v-ripple  @click.stop="dialog_read = true" class="pl-3">
                <v-list-tile-title v-html="review.title" style="color:#424242"></v-list-tile-title>
                <v-list-tile-sub-title style="color:#616161">{{review.subtitle}} hours played</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </v-list>
        <v-layout row justify-space-around>
          <v-btn flat dark @click.stop="dialog_review = true">Add Review</v-btn>
        </v-layout>
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
      <v-dialog v-model="dialog_review" max-width="500px">
        <v-card>
          <v-card-title class="ma-0 pl-3 pr-0 pt-0 pb-0">
            <v-spacer></v-spacer>
            <v-btn icon @click.stop="dialog_review=false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="ma-0 pa-0">
              <form @keyup.enter="submit">
                <v-layout row justify-space-around>
                  <div>
                    <div class="display-3">{{review_score + '%'}}</div>
                    <div style="font-size: 16px; text-align: center">Score</div>
                  </div>
                </v-layout>
                <v-slider class="pl-3" v-model="review_score"></v-slider>
                <v-flex xs12>
                  <v-divider></v-divider>
                  <v-text-field
                    label="Title"
                    single-line
                    full-width
                    hide-details
                    v-model="review_title"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-divider></v-divider>
                  <v-text-field
                    label="Message"
                    v-model="review_message"
                    counter
                    max="300"
                    full-width
                    multi-line
                    single-line
                  ></v-text-field>
                </v-flex>
                <v-layout row justify-space-around class="pt-3">
                  <v-btn flat dark>Submit Review</v-btn>
                </v-layout>
              </form>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialog_read" max-width="500px" transition="slide-y-reverse-transition">
        <v-card light>
          <v-card-title class="ma-0 pl-0 pr-0 pt-0 pb-0">
            <v-btn icon dark @click='toggleLove(card)'>
              <v-icon v-if="user_info.love_list.indexOf(card.id) > -1" color="red">favorite</v-icon>
              <v-icon v-else>favorite</v-icon>
            </v-btn>
            <span dark>{{card.love_count}}</span>
            <v-spacer></v-spacer>
            <v-btn light icon @click.stop="dialog_read=false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-title>
            <span class="headline">Use Google's location service?</span>
          </v-card-title>
          <v-card-text>
            Lorem ipsum dolor sit amet, semper quis, sapien id natoque elit. Nostra urna at, magna at neque sed sed ante imperdiet, dolor mauris cursus velit, velit non, sem nec. Volutpat sem ridiculus placerat leo, augue in, duis erat proin condimentum in a eget, sed fermentum sed vestibulum varius ac, vestibulum volutpat orci ut elit eget tortor. Ultrices nascetur nulla gravida ante arcu. Pharetra rhoncus morbi ipsum, nunc tempor debitis, ipsum pellentesque, vitae id quam ut mauris dui tempor, aptent non. Quisque turpis. Phasellus quis lectus luctus orci eget rhoncus. Amet donec vestibulum mattis commodo, nulla aliquet, nibh praesent, elementum nulla. Sit lacus pharetra tempus magna neque pellentesque, nulla vel erat.
            Justo ex quisque nulla accusamus venenatis, sed quis. Nibh phasellus gravida metus in, fusce aenean ut erat commodo eros. Ut turpis, dui integer, nonummy pede placeat nec in sit leo. Faucibus porttitor illo taciti odio, amet viverra scelerisque quis quis et tortor, curabitur morbi a. Enim tempor at, rutrum elit condimentum, amet rutrum vitae tempor torquent nunc. Praesent vestibulum integer maxime felis. Neque aenean quia vitae nostra, tempus elit enim id dui, at egestas pulvinar. Integer libero vestibulum, quis blandit scelerisque mattis fermentum nulla, tortor donec vestibulum dolor amet eget, elit nullam. Aliquam leo phasellus aliquam curabitur metus a, nulla justo mattis duis interdum vel, mollis vitae et id, vestibulum erat ridiculus sit pulvinar justo sed. Vehicula convallis, et nulla wisi, amet vestibulum risus, quam ac egestas.
            Et vitae, nulla gravida erat scelerisque nullam nunc pellentesque, a dictumst cras augue, purus imperdiet non. Varius montes cursus varius vel tortor, nec leo a qui, magni cras, velit vel consectetuer lobortis vel. Nibh erat et wisi felis leo porttitor, sapien nibh sapien pede mi, sed eget porttitor, repellendus arcu ac quis. Luctus vulputate aut est sem magna, placerat accumsan nunc vestibulum ipsum ac auctor, maecenas lorem in ut nec mauris tortor, doloribus varius sem tortor vestibulum mollis, eleifend tortor felis tempus lacus eu eu. Eleifend vel eu, nullam maecenas mauris nec nunc euismod, tortor porta ridiculus potenti, massa tristique nam magna, et wisi placerat et erat ante. Eget pede erat in facilisis, fermentum venenatis sodales. Ac tortor sociis et non animi tristique, rhoncus malesuada, ut arcu volutpat scelerisque sollicitudin, elit curabitur dui pede purus dolor, integer aenean risus taciti nulla eleifend accumsan. At pulvinar diam parturient, interdum mi velit aliquet et a. Arcu at ac placerat eget justo semper, purus sociis curabitur mi ipsum consequat ut, mollis vestibulum, est ante ornare lacus sem. Neque magna mauris, commodo quisque, praesent semper suscipit lobortis nam. Justo malesuada cursus ac nunc litora nunc. Tellus ac, in lobortis nunc, montes lectus purus fermentum.
            Ac sit wisi. Sodales aliquam, sed vestibulum nullam arcu sit risus arcu, id luctus vitae lorem nibh, integer nec nullam class cursus mi, purus arcu lectus. Vel ante suscipit volutpat potenti mattis sed, wisi eu placerat aliquam erat, lectus morbi lobortis at assumenda. Consequat neque purus ipsum voluptas odio, netus vestibulum ut nec, suspendisse pellentesque nec enim in. Wisi dictum sed semper a, ipsum erat tellus habitasse est, erat sem ornare, vitae quisque ultricies. Dui sed blandit. Tempor et faucibus justo sed luctus, nec vitae vitae. Nunc nibh pede, ipsum vestibulum aenean leo ante ultricies, nam cras quis sed penatibus amet. In mauris a. Integer metus mauris tortor, et rutrum vestibulum ultricies, ut phasellus in ullamcorper ut mollit, eu justo. Cursus pretium venenatis.
            Cras pellentesque vel sodales accumsan aenean. Feugiat metus sit nec in aliquet amet, porttitor pretium vulputate massa. Consequat ipsum luctus quisque adipiscing libero. Wisi sollicitudin. Eget vitae ac lobortis, lorem natoque vestibulum et, aliquet faucibus at morbi nibh, vel condimentum. Massa unde orci sed id sed, odio donec congue nec praesent amet. Hymenaeos velit lacus, quis vivamus libero tempus duis, eu nisi eu, ipsum at accumsan pede justo morbi donec, massa et libero sit risus neque tortor. Ut sed sed etiam hendrerit dapibus, quis metus suspendisse nibh.
          </v-card-text>
          <v-layout row justify-space-around>
            <div>
              <div class="display-3">{{review_score}}<small>%</small></div>
            </div>
          </v-layout>
        </v-card>
      </v-dialog>
    </v-flex>
  </v-layout>
</template>

<script>
import _ from 'lodash'
import axios from '~/plugins/axios'

export default {
  data () {
    return {
      started: false,
      review_title: '',
      review_message: '',
      review_score: 50,
      reviews: [
          { avatar: 'https://vuetifyjs.com/static/doc-images/lists/1.jpg', title: 'Brunch this weekend?', subtitle: 80, love_count: 0 },
          { avatar: 'https://vuetifyjs.com/static/doc-images/lists/2.jpg', title: 'Summer BBQ', subtitle: 2, love_count: 0 },
          { avatar: 'https://vuetifyjs.com/static/doc-images/lists/3.jpg', title: 'Oui oui', subtitle: 5, love_count: 0 }
        ],
      valueDeterminate: 80,
      dialog2: false,
      dialog_review: false,
      dialog_read: false,
      chips: ['Programming', 'Playing video games', 'Watching', 'Sleeping'],
      blurConfig: {
        isBlurred: true, // activate and deactivate blur directive example 2
        opacity: 1,
        filter: 'blur(3px)',
        transition: 'all .3s linear'
      }/*,
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
      }*/
    }
  },
  mounted() {
    this.init()
  },
  async asyncData({ store, params, error }) {
    var username = store.state.user.username
    let userRes = await axios.get(`/users/${username}`)
    let gameRes = await axios.get(`/games/`)
    if (!userRes) error({ statusCode: 404, message: 'User not found' })
    if (!gameRes) error({ statusCode: 404, message: 'Game not found' })
    console.log("userinfo" + JSON.stringify(gameRes.data[0]))
    return {
       user_info: userRes.data[0],
       card: gameRes.data[0],
       initial_card: gameRes.data[0]
    }
  },
  methods: {
    init() {
      this.$store.commit('SET_TITLE', "Info")
      this.$store.commit('SET_SHOW_TOOLBAR', false)
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
      this.love_update('love')
    },
    toggleFavourite: function(card) {
      var love = true;
      if (this.user_info.bookmark_list.indexOf(card.id) > -1) {
        love = false;
      }
      if (love) {
        this.user_info.bookmark_list.push(card.id)
      } else {
        var index = this.user_info.bookmark_list.indexOf(card.id);
        if(index!=-1){
           this.user_info.bookmark_list.splice(index, 1);
        }
      }
      this.love_update('bookmark')
    },
    love_update (url) {
      axios.post('/games/' + this.card.id + '/toggle_' + url + '/' + this.$store.state.user.username)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }
}
</script>
