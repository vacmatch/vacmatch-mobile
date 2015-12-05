
let urls = {
  home: 'home',
  report: {
    list: 'reports/',
    show: function (reportId) {
      return 'report/' + reportId
    }
  },
  event: {
    list: function (reportId) {
      return 'events/' + reportId + '/'
    },
    add: function (reportId, eventType) {
      return 'addEvent/' + reportId + '/' + eventType
    }
  }
}

module.exports = urls
