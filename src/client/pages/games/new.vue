<template>
  <v-container>
    <v-layout>
      <v-flex xs12 sm10 md8 lg6 xl6>
        <form @keyup.enter="submit" v-model="valid" ref="form">
          <v-text-field
            v-model="title"
            :counter="20"
            name="title"
            label="title"
            required
          ></v-text-field>
          <v-select style="background-color: #424242"
    label="tags"
    chips
    tags
    solo
    prepend-icon="filter_list"
    append-icon=""
    clearable
    v-model="chips"
  >
    <template slot="selection" slot-scope="data">
      <v-chip
        style="color: #ffffff; background-color: #616161" close
        @input="remove(data.item)"
        :selected="data.selected"
      >
        {{ data.item }}
      </v-chip>
    </template>
  </v-select>
          <!--<v-select
            :items="type"
            v-model="selected_type"
            label="type"
            single-line
            required
          ></v-select>-->
          <!--<v-card class="mb-3">
            <v-card-text>
              <v-text-field
                v-model="name"
                :rules="nameRules"
                :counter="20"
                name="name"
                label="name"
                required
              ></v-text-field>
            </v-card-text>
          </v-card>-->
          <v-card class="mt-3 mb-3">
            <v-progress-linear class="pt-0 mt-0 mb-0" style="position: absolute" v-show="character_searching" :indeterminate="true"></v-progress-linear>
            <v-card-media
              height="200px"
              style="background-color: #383838"
            >
              <img v-if="selected_character.bases"
                :src="selected_character.bases[0].url"
                style="height: 200px; width: auto; margin-left: auto;
margin-right: auto;"/>
              <v-layout v-else justify-space-around class="mb-2">
                <v-icon>image</v-icon>
              </v-layout>
            </v-card-media>
            <v-card-text>
              <v-text-field
                v-model="character_name"
                :counter="50"
                label="character"
                required
                hint="used in the thumbnail"
                persistent-hint
              ></v-text-field>
              <v-list v-if="show_character_suggestions && (character_suggestions.length > 0)" style="position: relative; top: -25px" light>
            <v-list-tile  v-for="character in character_suggestions" @click="select_character(character)">
              <v-list-tile-avatar>
                <img v-if="character.bases" :src="character.bases[0].url">
              </v-list-tile-avatar>
              <v-list-tile-content >
                <v-list-tile-title  >{{character.name}}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
              <v-btn v-if="(character_suggestions.length <= 0) || (character_name.length <= 0)"  flat  block class="pb-0 mb-0"  @click.stop="dialog2 = true">Add new asset</v-btn>
            </v-card-text>
          </v-card>
          <v-card class="mb-0">
            <v-progress-linear class="pt-0 mt-0 mb-0" style="position: absolute" v-show="background_searching" :indeterminate="true"></v-progress-linear>
            <v-card-media
              height="200px"
              style="background-color: #383838"
            >
              <img v-if="selected_background.url"
                :src="selected_background.url"
                style="height: 200px; width: auto; margin-left: auto;
margin-right: auto;"/>
              <v-layout v-else justify-space-around class="mb-2">
                <v-icon>image</v-icon>
              </v-layout>
            </v-card-media>
            <v-card-text>
              <v-text-field
                autocomplete="off"
                v-model="background_name"
                :counter="50"
                label="background"
                required
                hint="used in the thumbnail"
                persistent-hint
              ></v-text-field>
              <v-list v-if="show_background_suggestions && (background_suggestions.length > 0)" style="position: relative; top: -25px" light>
            <v-list-tile  v-for="background in background_suggestions" @click="select_background(background)">
              <v-list-tile-content >
                <v-list-tile-title  >{{background.name}}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
              <v-btn v-if="(background_suggestions.length <= 0) || (background_name.length <= 0)"  flat  block class="pb-0 mb-0" @click.stop="dialog = true">Add new asset</v-btn>
            </v-card-text>
          </v-card><v-layout row justify-space-around class="subheading pt-3">
            thumbnail preview
          </v-layout><v-card
            class="pa-0 mb-0 ml-0 mr-0"
            light
            style="border-radius: 20px; background-color: rgba(255, 255, 255, 0.0); position:relative; margin: 10px;"
            >
              <img v-if="selected_character.bases"
                style="position:absolute; bottom:0; height: 230px; z-index: 2; right: 0px; left: 0px; margin: 0 auto; border-radius: 0px;"
                :src="selected_character.bases[0].url"
                />
                <div style="position:absolute; bottom:0; height: 50px; width: 100%; z-index: 1; background-color: #ffffff; border-bottom-right-radius: 20px; border-bottom-left-radius: 20px;">
                </div>
            <v-card-media
              height="180px"
            >
            <div  class="novel-text main-gradient" style="opacity: 0.5; height: 100%; padding-top: 60px; width: 100%; position: absolute; z-index: 2; text-align: center; color: #ffffff; border-top-left-radius: 20px; border-top-right-radius: 20px;">
              <div style="font-size: 24px;">{{title}}</div>
              <div style="font-size: 21px;">by <i>{{$store.state.user.username}}</i></div>
            </div>
            <img
              style="z-index: 1; border-top-left-radius: 20px; border-top-right-radius: 20px;"
              v-blur="blurConfig"
              :src="selected_background.url"
              />
            </v-card-media>
            <v-card-actions style="background-color: rgba(255, 255, 255, 0.8); z-index: 3; position: relative;">
              <v-btn icon light>
                <v-icon color="grey">favorite</v-icon>
              </v-btn>
              <span  style="color: #9E9E9E">0</span>
              <v-spacer></v-spacer>
              <v-btn icon light>
                <v-icon color="grey">bookmark</v-icon>
              </v-btn>
              <v-btn icon light>
                <v-icon color="grey">share</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
          <v-layout row justify-space-around class="pt-3">
            <v-btn :disabled="!valid" @click="submit">Submit</v-btn>
          </v-layout>
        </form>
      </v-flex>
      <v-dialog
        v-model="dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        scrollable
      >
      <v-card tile>
        <v-toolbar card dark >
         <v-btn icon dark @click.native="dialog = false">
           <v-icon>close</v-icon>
         </v-btn>
         <v-toolbar-title>Add New Background</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <tree-menu
            @clicked="onClickChild"
            :show_toolbar="true"
            :forced_type="'BACKGROUND'">
            </tree-menu>
        </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="dialog2"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        scrollable
      >
      <v-card tile>
        <v-toolbar card dark >
          <v-btn icon dark @click.native="dialog2 = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Add New Character</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
          <tree-menu
            @clicked="onClickChild"
            :show_toolbar="true"
            :forced_type="'CHARACTER'">
            </tree-menu>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-container>
</template>

<script>
import _ from 'lodash'
import axios from '~/plugins/axios'
import Cookies from 'js-cookie'
import TreeMenu from './../assets/new.vue'
export default {
  middleware: 'authenticated',
  props: [ 'redirect' ],
  data () {
    return {
      dialog: false,
      dialog2: false,
      title: '',
      character_id: '',
      character_name: '',
      background_id: '',
      background_name: '',
      tags: [

      ],
      chips: [


      ],
      blurConfig: {
        isBlurred: true, // activate and deactivate blur directive example 2
        opacity: 1,
        filter: 'blur(1.3px)',
        transition: 'all .3s linear'
      },
      show_background_suggestions: false,
      show_character_suggestions: false,
      selected_background: {

      },
      selected_character: {

      },
      character_suggestions: [

      ],
      background_suggestions: [

      ],
      items: [
          { icon: true, title: 'Jason Oner', avatar: '/static/doc-images/lists/1.jpg' },
          { title: 'Travis Howard', avatar: '/static/doc-images/lists/2.jpg' },
          { title: 'Ali Connors', avatar: '/static/doc-images/lists/3.jpg' },
          { title: 'Cindy Baker', avatar: '/static/doc-images/lists/4.jpg' }
      ],
      character_searching: false,
      background_searching: false,
      valid: false
    }
  },
  mounted() {
    this.init()
  },
  components: {
    TreeMenu
  },
  /*methods: {
    init() {
      this.$store.commit('SET_TITLE', "Info")
      this.$store.commit('SET_SHOW_TOOLBAR', false)
    }
  }*/
  watch: {
    character_name: function() {
      this.search_characters()//s()
    },
    background_name: function() {
      this.search_backgrounds()
    }
  },
  methods: {
    init() {
      this.$store.commit('SET_TITLE', "New Game")
      this.$store.commit('SET_SHOW_TOOLBAR', true)
    },
    async onClickChild (value) {
      this.dialog2 = false
      this.dialog = false
      console.log("value:" + JSON.stringify(value)) // someValue
      switch (value.type) {
        case 'CHARACTER':
          console.log("looking for character")
          let master_asset_res = await axios.get(`/assets/master/${value.master_id}`)
          console.log("master asset res " + JSON.stringify(master_asset_res))
          this.selected_character = master_asset_res.data;
          this.character_name = this.selected_character.name
          break;
        case 'BACKGROUND':
          let base_asset_res = await axios.get(`/assets/base/${value.id}`)
          this.selected_background = base_asset_res.data;
          this.background_name = this.selected_background.name
          break;
      }
    },
    remove (item) {
      this.chips.splice(this.chips.indexOf(item), 1)
      this.chips = [...this.chips]
    },
    submit () {
      /*this.$store.dispatch('game/new', {
        title: this.title,
        username: this.$store.state.user.username
      }).then(() => {
        console.log("saved")
      })*/
    },//},
    search_characters: _.debounce(async function(type) {
      console.log("searching for characters")
      if (this.character_name) {
        this.show_character_suggestions = true;
        this.character_searching = true;
        let master_asset_res = await axios.get(`/assets/master/type/CHARACTER/search/${this.character_name}`)
        this.character_searching = false;
        this.character_suggestions = master_asset_res.data
      }
    }, 500),
    search_backgrounds: _.debounce(async function(type) {
      console.log("searching for backgrounds")
      if (this.background_name) {
        this.show_background_suggestions = true;
        this.background_searching = true;
        let base_asset_res = await axios.get(`/assets/base/type/BACKGROUND/search/${this.background_name}`)
        this.background_searching = false;
        this.background_suggestions = base_asset_res.data
      }
    }, 500),
    select_character: function(character) {
      this.show_character_suggestions = false
      this.selected_character = character
      this.character_name = this.selected_character.name
    },
    select_background: function(background) {
      this.show_background_suggestions = false
      this.selected_background = background
      this.background_name = this.selected_background.name
    }
  }
}
</script>
