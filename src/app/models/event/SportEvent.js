
class SportEvent {
  constructor () {
    this.type = null
  }

  areYou (eventType) {
    return eventType === this.type
  }
}

module.exports = SportEvent
