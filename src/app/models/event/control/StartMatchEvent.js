import SportEvent from '../SportEvent'

class StartMatchEvent extends SportEvent {
  constructor () {
    super()
    this.type = 'start-match'
    this.title = 'Start match'
    this.subtitle = 'start match'
    this.causes = []
    this.iconClass = ''
    this.component = null
  }

  isControl () {
    return true
  }
}

module.exports = StartMatchEvent
