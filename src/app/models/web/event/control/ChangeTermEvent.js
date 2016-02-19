import SportEvent from '../SportEvent'

class ChangeTermEvent extends SportEvent {
  constructor () {
    super()
    this.type = 'change-term'
    this.title = 'Change Term'
    this.subtitle = 'change term'
    this.causes = []
    this.iconClass = ''
    this.component = null
  }

  isControl () {
    return true
  }
}

module.exports = ChangeTermEvent
