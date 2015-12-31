
let urls = {
  home: 'home',
  login: {
    show: 'login/'
  },
  report: {
    list: 'reports/',
    show: function (reportId) {
      return 'report/' + reportId
    },
    end: function (reportId) {
      return 'end/report/' + reportId
    }
  },
  call: {
    list: function (reportId) {
      return 'call/report/' + reportId
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
