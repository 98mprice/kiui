import axios from '~/plugins/axios'
import Cookies from 'js-cookie'

export const state = () => {
  return {
    username: '',
    title: '',
    love_count: 0,
    character: '',
    background: ''
  }
}

export const mutations = {

}

export const actions = {
  async new ({ commit }, payload) {
    try {
      let { data } = await axios.post('/games', payload)
      commit('notification/SUCCESS', data, { root: true })
    } catch (error) {
      commit('notification/FAILURE', error.response.data, { root: true })
    }
  },
  async game ({ commit }, payload) {
    try {
      let { data } = await axios.post('/games/id/' + payload.id, payload)
      commit('notification/SUCCESS', data, { root: true })
    } catch (error) {
      commit('notification/FAILURE', error.response.data, { root: true })
    }
  }
}
