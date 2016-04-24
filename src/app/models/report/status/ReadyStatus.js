import ReportStatusInterface from './ReportStatusInterface'
import ReportStatus from '../ReportStatus'
import EndMatchEvent from '../../web/event/control/EndMatchEvent'
import StartMatchEvent from '../../web/event/control/StartMatchEvent'
import ReportStatusException from '../../exception/ReportStatusException'

class ReadyStatus extends ReportStatusInterface {

  constructor () {
    super()
    this.isInitialized = true
  }

  addEvent (eventType) {
    if (!this.isInitialized) {
      this.constructor()
    }
    switch (eventType) {
      case new StartMatchEvent().type: {
        return ReportStatus.STARTED
      }
      case new EndMatchEvent().type: {
        return new ReportStatusException("You can't add a finish match event, match must be started first", 'ReportStatus', ReportStatus.STARTED)
      }
      default:
        return null
    }
  }

  removeEvent (eventType) {
    if (!this.isInitialized) {
      this.constructor()
    }
    switch (eventType) {
      case new StartMatchEvent().type: {
        console.log('Removing StartMatchEvent in a READY match but no STARTED')
        return ReportStatus.READY
      }
      case new EndMatchEvent().type: {
        console.log('Removing EndMatchEvent in a READY match but no FINISHED')
        return ReportStatus.READY
      }
      default:
        return null
    }
  }

}

module.exports = ReadyStatus
