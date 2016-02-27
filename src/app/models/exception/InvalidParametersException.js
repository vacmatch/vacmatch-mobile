
class InvalidParametersException {

  constructor (message, className, value) {
    this.name = 'InvalidParametersException'
    this.message = message
    this.className = className
    this.value = value
  }

  toString () {
    return this.name + ': ' + this.className + ' == ' + this.value + ' - ' + this.message
  }

}

module.exports = InvalidParametersException
