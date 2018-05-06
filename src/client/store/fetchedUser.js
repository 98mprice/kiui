import axios from '~/plugins/axios'

export const state = () => {
  return {
    username: '',
    email: '',
    love_list: [],
    bookmark_list: []
  }
}

export const mutations = {
  FETCH_LOVE_LIST_REQUEST (state) {
    console.log('fetchLove pending...')
  },
  FETCH_LOVE_LIST_SUCCESS (state, data) {
    state.love_list = data.love_list
    state.bookmark_list = data.bookmark_list
    console.log('fetchLove success!')
  },
  FETCH_LOVE_LIST_FAILURE (state, error) {
    console.error(error.response.data.error)
  },
  FETCH_USER_REQUEST (state) {
    console.log('fetchUser pending...')
  },
  FETCH_USER_SUCCESS (state, data) {
    state.username = data.username
    state.email = data.email
    console.log('fetchUser success!')
  },
  FETCH_USER_FAILURE (state, error) {
    console.error(error.response.data.error)
  }
}

export const actions = {
  async fetchUser ({ state, commit }, { username }) {
    try {
      commit('FETCH_USER_REQUEST')
      let { data } = await axios.get(`/users/${username}`)
      commit('FETCH_USER_SUCCESS', data)
    } catch (error) {
      commit('FETCH_USER_FAILURE', error)
    }
  },
  async fetchLove ({ state, commit }, { username }) {
    try {
      commit('FETCH_LOVE_LIST_REQUEST')
      let { data } = await axios.get(`/users/love/${username}`)
      commit('FETCH_LOVE_LIST_SUCCESS', data)
    } catch (error) {
      commit('FETCH_LOVE_LIST_FAILURE', error)
    }
  }
}
