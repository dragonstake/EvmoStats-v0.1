export const state = () => ({
  timestamp: 0,
})

export const mutations = {
  update(state, value) {
    state.timestamp = value
  },
}
