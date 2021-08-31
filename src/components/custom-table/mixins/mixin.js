export default {
  methods: {
    search (data) {
      this.$emit('search',data)
    }
  },
}