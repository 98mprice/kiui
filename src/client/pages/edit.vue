<template>
  <v-layout>
    <v-flex xs12 sm6 offset-sm3>
    <!--<div style="overflow: hidden;"><div
      style="background-image: url(https://vignette.wikia.nocookie.net/aceattorney/images/b/b3/Shipshape.png/revision/latest?cb=20160512202551); z-index: 1; position: absolute; height: 200px; width: 100%; margin-left: auto; margin-right: auto; transition: background-size 4s ease; background-size: 120%; background-position: center center;" v-blur="blurConfig"></div>
    </div>-->
    <v-card style="border-radius: 5px; z-index: 2;" class="ma-2" light>
      <v-card-media height="200px"
                >
                  <img v-blur="blurConfig"
                  src="https://vignette.wikia.nocookie.net/aceattorney/images/b/b3/Shipshape.png/revision/latest?cb=20160512202551"
                  height="200px" style="position: absolute; height: 100%; width: 100%; z-index: 2;"/>
                  <v-layout align-end style="position: absolute; z-index: 3; width: 100%;">
                    <v-card-title primary-title class="ma-0 pl-3 pr-3 pb-1 pt-1" style="background-color: rgba(255, 255, 255, 0.8); width: 100%; height: auto">
                        <h3 class="subheading mb-0">
                          <v-text-field style="box-shadow: none; background-color: transparent" light solo label="First Name" v-model="first"></v-text-field>
                        </h3>
                        <v-spacer></v-spacer>
                        <v-btn icon light @click.native="show = !show">
                          <v-icon>{{ show ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
                        </v-btn>
                      </v-card-title>
                    </v-layout>
                </v-card-media>
      <!--<v-card-title primary-title style="background-color:#EC407A" class="white--text ma-0 pl-3 pr-3 pb-1 pt-1">
          <h3 class="subheading mb-0">Kangaroo Valley Safari</h3>
          <v-spacer></v-spacer>
          <v-btn icon @click.native="show = !show">
            <v-icon>{{ show ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
          </v-btn>
        </v-card-title>-->
      <v-slide-y-transition>
        <v-card-text v-show="show" class="ma-0 pa-0">
          <v-list dense light>
            <draggable :list="items">
              <template v-for="(item, index) in items">
                <v-list-tile avatar :key="item.title" @click="">
                  <v-list-tile-avatar>
                    <img :src="item.avatar">
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-text-field light solo label="First Name" v-model="first"></v-text-field>
                  </v-list-tile-content>
                </v-list-tile>
              </template>
            </draggable>
          </v-list>
        </v-card-text>
      </v-slide-y-transition>
    </v-card>
  </v-flex>
  </v-layout>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  middleware: 'authenticated',
  components: {
      draggable,
  },
  data () {
    return {
      first: 'John',
      last: 'Doe',
      show: true,
      list:[{name:"John"},
				{name:"Joao"},
				{name:"Jean"} ],
      blurConfig: {
          isBlurred: true, // activate and deactivate blur directive example 2
          opacity: 1,
          filter: 'blur(6.3px)',
          transition: 'all .3s linear'
        },
      items: [
        { avatar: 'https://vuetifyjs.com/static/doc-images/lists/1.jpg', title: 'Brunch this weekend?', subtitle: "nkjkj" },
        { avatar: 'https://vuetifyjs.com/static/doc-images/lists/2.jpg', title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>', subtitle: "bhjbhbhj" },
        { avatar: 'https://vuetifyjs.com/static/doc-images/lists/3.jpg', title: 'Oui oui', subtitle: "jnjkjmn " }
      ]
    }
  },
  mounted () {
    this.init()
  },
  methods:{
			add: function(){
				this.list.push({name:'Juan'});
			},
			replace: function(){
				this.list=[{name:'Edgard'}]
			},
      init() {
        this.$store.commit('SET_TITLE', "Edit")
        this.$store.commit('SET_SHOW_TOOLBAR', true)
      }
		}
}
</script>
