<template>
  <v-app id="inspire" dark>
    <v-navigation-drawer
      fixed
      enable-resize-watcher
      disable-route-watcher
      persistent
      light
      v-model="drawer"
      app>
      <v-list class="other-gradient main-list" style="position: relative; height: 200px">
        <img style="margin-right: 10px; bottom: 0; right: 0; position: absolute; height: 80%" src="~/assets/img/hhg.gif"/>
        <v-list-tile avatar tag="div" style="background-color: rgba(255, 255, 255, 0.9); width: 100%; position: absolute;  bottom: 0;">
          <v-list-tile-avatar>
            <img src="https://randomuser.me/api/portraits/men/85.jpg" />
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title >
              {{$store.state.user.username}}
              </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-list>
        <v-list-tile light ripple router to="/games/" @click="drawer = !drawer">
          <v-list-tile-action>
            <v-icon>play_arrow</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Play</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile ripple router to="/games/" @click="drawer = !drawer">
          <v-list-tile-action>
            <v-icon>dashboard</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Browse</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-group >
          <v-list-tile slot="item">
            <v-list-tile-action icon light>
              <v-icon icon light>palette</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>New</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon light>keyboard_arrow_down</v-icon>
            </v-list-tile-action>
          </v-list-tile>
          <v-list-tile ripple >
            <v-list-tile-action >
              <v-icon icon>add</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>New</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile ripple>
            <v-list-tile-action >
              <v-icon icon>add</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>New</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-group>
      </v-list>
      <v-list>
        <v-list-group v-for="item in items" :value="item.active" v-bind:key="item.title">
          <v-list-tile slot="item" :ripple="!item.items" :router="!item.items" :to="item.to ? item.to : ''">
            <v-list-tile-action icon light>
              <v-icon icon light>{{ item.action }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action v-if="item.items">
              <v-icon light>keyboard_arrow_down</v-icon>
            </v-list-tile-action>
          </v-list-tile>
          <v-list-tile v-for="subItem in item.items" v-bind:key="subItem.title" ripple>
            <v-list-tile-content>
              <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon>{{ subItem.action }}</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar v-if="this.$store.state.show_toolbar" app fixed class="main-gradient" style="z-index: 4;">
      <v-toolbar-side-icon v-if="$store.state.user.isAuthenticated" dark @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>{{$store.state.title}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <!--<v-menu bottom left>
        <v-btn icon="icon" slot="activator" dark>
          <v-icon>more_vert</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile ripple router to="/users/auth/sign-in" v-if="!$store.state.user.isAuthenticated">
            <v-list-tile-title>Sign In</v-list-tile-title>
          </v-list-tile>
          <v-list-tile ripple router to="/users/auth/sign-up" v-if="!$store.state.user.isAuthenticated">
            <v-list-tile-title>Sign Up</v-list-tile-title>
          </v-list-tile>
          <v-list-tile ripple router to="/users/auth/sign-out" v-if="$store.state.user.isAuthenticated">
            <v-list-tile-title>Sign Out</v-list-tile-title>
          </v-list-tile>
          <v-list-tile ripple router to="/users">
            <v-list-tile-title>Users</v-list-tile-title>
          </v-list-tile>
          <v-list-tile ripple router to="/admin" v-if="$store.state.user.admin">
            <v-list-tile-title>Admin</v-list-tile-title>
          </v-list-tile>
          <v-list-tile ripple router to="/play" >
            <v-list-tile-title>Play</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>-->
    </v-toolbar>
    <v-content app clipped-left>
      <v-container fluid style="padding: 0px">
        <v-layout>
          <nuxt></nuxt>
        </v-layout>
      </v-container>
    </v-content>
    <v-snackbar
      :timeout="2000"
      :bottom="true"
      v-model="snackbar">
      {{ $store.state.notification.text }}
      <v-btn dark flat color="pink" @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
// search icons: https://material.io/icons/ asd
export default {
  props: {
    source: String
  },
  data () {
    return {
      drawer: null,
      items: [
        {
          action: 'android',
          title: 'Something',
          items: [
            { title: 'First' },
            { title: 'Second' },
            { title: 'Third' }
          ]
        },
        {
          action: 'settings',
          title: 'Settings',
          items: [
            { title: 'Payment' },
            { title: 'Account' },
            { title: 'Privacy' }
          ]
        }
      ],
      name: 'kiui1',
      mini: true,
      right: null
    }
  },
  computed: {
    snackbar: {
      get () {
        return this.$store.state.notification.snackbar
      },
      set (value) {
        this.$store.commit('notification/UPDATE_SNACKBAR', value)
      }
    },
    snackbarColor () {
      return this.$store.state.notification.context
    }
  }
}
</script>
