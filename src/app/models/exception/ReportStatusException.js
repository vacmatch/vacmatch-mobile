
class ReportStatusException {

  constructor (message, className, value) {
    this.name = 'ReportStatusException'
    this.message = message
    this.className = className
    this.value = value
  }

  toString () {
    return this.name + ': ' + this.className + ' == ' + this.value + ' - ' + this.message
  }

}

module.exports = ReportStatusException
