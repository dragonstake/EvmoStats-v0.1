import moment from 'moment'
export default {
  methods: {
    timestampToDate(timestamp, format = 'YYYY[/]MM[/]DD HH[:]mm') {
      return moment(timestamp).format(format)
    },
  },
}
