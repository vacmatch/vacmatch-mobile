
let CronoUtils = {
  // Parse crono string and convert it to milisecond
  stringToMiliseconds: function (time) {
    let elements = time.split(':')
    return (parseInt(elements[0], 10) * 60000) + (parseInt(elements[1], 10) * 1000)
  },

  // Create crono string from milisecond
  milisecondsToString: function (miliseconds) {
    let date = new Date(miliseconds)
    return (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() +
      ':' + (date.getSeconds() < 10 ? '0' : '') + date.getSeconds()
  }
}

module.exports = CronoUtils
