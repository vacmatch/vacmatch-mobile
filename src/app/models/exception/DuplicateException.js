
class DuplicateException {

  constructor (message, className, value) {
    this.name = 'DuplicateException'
    this.message = message
    this.className = className
    this.value = value
  }

  toString () {
    return this.name + ': ' + this.className + ' == ' + this.value + ' - ' + this.message
  }

}

module.exports = DuplicateException
