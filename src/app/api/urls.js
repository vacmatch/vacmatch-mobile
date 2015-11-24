
let urls = {
  home: 'home',
  report: {
    list: 'reports/',
    show: function (reportId) {
      return 'report/' + reportId
    }
  }
}

module.exports = urls
