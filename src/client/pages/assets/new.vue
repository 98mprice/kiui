<template>
  <v-container class="tree-menu">
    <v-layout>
      <v-flex xs12 sm10 md8 lg6 xl6>
        <form @keyup.enter="submit" v-model="valid" ref="form" lazy-validation>
          <v-select
            :items="type"
            v-model="selected_type"
            label="type"
            single-line
            required
            v-if="!this.forced_type"
          ></v-select>
          <v-select
            :items="type"
            v-model="selected_type"
            label="type"
            single-line
            required
            v-else
            disabled
          ></v-select>
          <v-card class="mb-3" v-if="selected_type == 'CHARACTER'">
            <v-progress-linear class="pt-0 mt-0 mb-0" style="position: absolute" v-show="character_searching" :indeterminate="true"></v-progress-linear>
            <v-card-text>
              <v-text-field
                v-model="character_name"
                :rules="nameRules"
                :counter="20"
                name="name"
                label="character name"
                required
                hint="actual name of your character"
                persistent-hint
                autocomplete="off"
              ></v-text-field>
              <v-list v-if="show_character_suggestions && (character_suggestions.length > 0)" style="position: relative; top: -25px" light>
            <v-list-tile  v-for="character in character_suggestions" @click="select_character(character)">
              <v-list-tile-content >
                <v-list-tile-title  >{{character.name}}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>

            </v-card-text>
          </v-card>
          <v-card>
            <v-card-text>
              <v-text-field
                v-model="name"
                :rules="nameRules"
                :counter="20"
                name="name"
                label="asset name"
                required
                hint="describes the image (not the character)"
                persistent-hint
                autocomplete="off"
              ></v-text-field>
            </v-card-text>
            <v-card-media
              height="200px"
              style="background-color: #383838"
            >
              <img
                v-if="url &&
                  ((selected_type == 'CHARACTER')
                  || (selected_type == 'BACKGROUND')
                  || (selected_type == 'OVERLAY'))"
                :src="url"
                style="height: 200px; width: auto; margin-left: auto;
margin-right: auto;"/>
              <v-layout v-else justify-space-around class="mb-2">
                <v-icon>{{icon}}</v-icon>
              </v-layout>
            </v-card-media>
            <v-card-text>
              <v-text-field
                v-model="url"
                :rules="urlRules"
                :counter="50"
                name="url"
                :label="input_type + ' url'"
                required
              ></v-text-field>
            </v-card-text>
          </v-card>
          <v-layout row justify-space-around class="pt-3">
            <v-btn @click="submit">Submit</v-btn>
          </v-layout>
        </form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from '~/plugins/axios'
import _ from 'lodash'
import Cookies from 'js-cookie'
export default {
  middleware: 'authenticated',
  props: [ 'redirect', 'show_toolbar', 'forced_type' ],
  data () {
    return {
      valid: false,
      name: '',
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 20) || 'Name must be less than 20 characters'
      ],
      selected_type: '',
      type: [
          { text: 'Character', value: 'CHARACTER' },
          { text: 'Background', value: 'BACKGROUND' },
          { text: 'Overylay', value: 'OVERLAY' },
          { text: 'Music', value: 'MUSIC' },
          { text: 'Sound Effect', value: 'SOUND_EFFECT' }
        ],
      url: '',
      urlRules: [
        v => !!v || 'url is required',
        v => (v && v.length <= 50) || 'url must be less than 50 characters'
      ],
      character_name: '',
      character_suggestions: [

      ],
      show_character_suggestions: false,
      character_searching: false
    }
  },
  computed: {
    icon: function() {
      switch (this.selected_type) {
        case 'CHARACTER': return 'photo'
        case 'BACKGROUND': return 'photo'
        case 'OVERLAY': return 'directions_run'
        case 'MUSIC': return 'library_music'
        case 'SOUND_EFFECT': return 'library_music'
      }
      return 'help_outline'
    },
    input_type: function() {
      switch (this.selected_type) {
        case 'CHARACTER': return 'image'
        case 'BACKGROUND': return 'image'
        case 'OVERLAY': return 'image'
        case 'MUSIC': return 'music'
        case 'SOUND_EFFECT': return 'sound effect'
      }
      return ''
    }
  },
  mounted() {
    this.init()
  },
  name: 'tree-menu',
  /*methods: {
    init() {
      this.$store.commit('SET_TITLE', "Info")
      this.$store.commit('SET_SHOW_TOOLBAR', false)
    }
  }*/

  watch: {
    character_name: function() {
      this.search_characters()
      //this.search_characters()//s()
    }
  },
  methods: {
    init() {
      this.$store.commit('SET_TITLE', "New Asset")
      this.$store.commit('SET_SHOW_TOOLBAR', true)
      if (this.forced_type) {
        this.selected_type = this.forced_type
      }
    },
    search_characters: _.debounce(async function() {
      console.log("searching for characters")
      if (this.character_name) {
        this.show_character_suggestions = true;
        this.character_searching = true;
        let master_asset_res = await axios.get(`/assets/master/type/CHARACTER/search/${this.character_name}`)
        this.character_searching = false;
        this.character_suggestions = master_asset_res.data
      }
    }, 500),
    select_character: function(character) {
      this.show_character_suggestions = false
      this.selected_character = character
      this.character_name = this.selected_character.name
    },
    async submit () {
        let master_asset_res = await axios.post('/assets/base', {
          master_name: this.character_name,
          name: this.name,
          type: this.selected_type,
          url: this.url,
          username: this.$store.state.user.username
        })
        console.log("done" + JSON.stringify(master_asset_res.data))
        if (this.show_toolbar == true) {
          this.$emit('clicked', {
            type: this.selected_type,
            master_id: master_asset_res.data.master_id,
            id: master_asset_res.data.id
          });
        }
    },
    suggest: _.debounce(function() {

    })
  }
}
</script>
