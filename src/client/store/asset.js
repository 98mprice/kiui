import axios from '~/plugins/axios'
import Cookies from 'js-cookie'

export const state = () => {
  return {

  }
}

export const mutations = {

}

export const actions = {
  async new ({ commit }, payload) {
    try {
      console.log("sending off asset" + JSON.stringify(payload))
      let { data } = await axios.post('/assets', payload)
      commit('notification/SUCCESS', data, { root: true })
    } catch (error) {
      commit('notification/FAILURE', error.response.data, { root: true })
    }
  }
}
