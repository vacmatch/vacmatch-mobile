
class SportEvent {
  constructor () {
    this.type = null
  }

  areYou (eventType) {
    return eventType === this.type
  }

  isControl () {}
}

module.exports = SportEvent
