
class ExistingElementsException {

  constructor (message, className, value) {
    this.name = 'ExistingElementsException'
    this.message = message
    this.className = className
    this.value = value
  }

  toString () {
    return this.name + ': ' + this.className + ' == ' + this.value + ' - ' + this.message
  }

}

module.exports = ExistingElementsException
