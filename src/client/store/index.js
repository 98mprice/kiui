import axios from '~/plugins/axios'
import jwtDecode from 'jwt-decode'

export const state = () => {
  return {
    lists: {
      users: [],
      games: [],
      assets: []
    },
    title: "kiui1",
    show_toolbar: false
  }
}
export const mutations = {
  FETCH_ALL_ASSETS_SUCCESS (state, assets) {
    state.lists.assets = assets
    console.log('Fetch all assets success!' + JSON.stringify(assets))
  },
  FETCH_ALL_GAMES_SUCCESS (state, games) {
    state.lists.games = games
    console.log('Fetch all games success!' + JSON.stringify(games))
  },
  SET_TITLE (state, title) {
    state.title = title;
  },
  SET_SHOW_TOOLBAR (state, show_toolbar) {
    state.show_toolbar = show_toolbar;
  },
  SET_USER (state, data) {
    state.user.token = data.token
    state.user.isAuthenticated = true
    state.user.username = data.user.username
    state.user.email = data.user.email
  },
  SET_USERS (state, payload) {
    state.lists.users = payload.users
  },
  FETCH_ALL_USERS_REQUEST () {
    console.log('Fetching all users...')
  },
  FETCH_ALL_USERS_SUCCESS (state, users) {
    state.lists.users = users
    console.log('Fetch all users success!')
  },
  FETCH_ALL_USERS_FAILURE (state, error) {
    console.error(error.response.data)
  },
  CLEAR_LISTS (state) {
    // set each list to an empty array
    Object.keys(state.lists).forEach(list => {
      state.lists[list] = []
    })
  }
}
export const actions = {
  nuxtServerInit ({ commit, state }, { req }) {
    if (req.cookies.token) {
      let token = req.cookies.token
      let user = jwtDecode(token)
      let data = { user, token }
      commit('SET_USER', data)
    }
  },
  async fetchAllUsers ({ commit, state }) {
    try {
      commit('FETCH_ALL_USERS_REQUEST')
      let { data } = await axios.get('/users')
      commit('FETCH_ALL_USERS_SUCCESS', data)
    } catch (error) {
      commit('FETCH_ALL_USERS_FAILURE', error)
    }
  },
  async fetchAllGames ({ commit, state }) {
    try {
      console.log("im looking for games")
      let { data } = await axios.get('/games')
      commit('FETCH_ALL_GAMES_SUCCESS', data)
      //console.log("i found games boi" + JSON.stringify(data))
      //state.lists.games = data.games
    } catch (error) {
      console.error(error.response.data)
    }
  },
  async fetchAllAssets ({ commit, state }) {
    try {
      console.log("im looking for assets")
      let { data } = await axios.get('/assets/CHARACTER')
      commit('FETCH_ALL_ASSETS_SUCCESS', data)
      //console.log("i found games boi" + JSON.stringify(data))
      //state.lists.games = data.games
    } catch (error) {
      console.error(error.response.data)
    }
  }
}
