
class InstanceNotFoundException {

  constructor (message, className, value) {
    this.name = 'InstanceNotFoundException'
    this.message = message
    this.className = className
    this.value = value
  }

  toString () {
    return this.name + ': ' + this.className + ' == ' + this.value + ' - ' + this.message
  }

}

module.exports = InstanceNotFoundException
