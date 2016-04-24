import ReportStatusInterface from './ReportStatusInterface'
import ReportStatus from '../ReportStatus'
import ReportStatusException from '../../exception/ReportStatusException'
import EndMatchEvent from '../../web/event/control/EndMatchEvent'
import StartMatchEvent from '../../web/event/control/StartMatchEvent'

class StartedStatus extends ReportStatusInterface {

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
        return new ReportStatusException("You can't add another start match event", 'ReportStatus', ReportStatus.STARTED)
      }
      case new EndMatchEvent().type: {
        return ReportStatus.FINISHED
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
        return ReportStatus.READY
      }
      case new EndMatchEvent().type: {
        console.log('Removing EndMatchEvent in a STARTED match but no FINISHED')
        return ReportStatus.STARTED
      }
      default:
        return null
    }
  }

}

module.exports = StartedStatus
