import SportEvent from '../SportEvent'

class EndMatchEvent extends SportEvent {
  constructor () {
    super()
    this.type = 'end-match'
    this.title = 'End match'
    this.subtitle = 'end match'
    this.causes = []
    this.iconClass = ''
    this.component = null
  }

  isControl () {
    return true
  }
}

module.exports = EndMatchEvent
