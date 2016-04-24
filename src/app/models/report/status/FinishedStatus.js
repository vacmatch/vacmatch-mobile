import ReportStatusInterface from './ReportStatusInterface'
import ReportStatus from '../ReportStatus'
import ReportStatusException from '../../exception/ReportStatusException'
import EndMatchEvent from '../../web/event/control/EndMatchEvent'
import StartMatchEvent from '../../web/event/control/StartMatchEvent'

class FinishedStatus extends ReportStatusInterface {

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
        return new ReportStatusException("You can't add a start match event because match is finished", 'ReportStatus', ReportStatus.FINISHED)
      }
      case new EndMatchEvent().type: {
        return new ReportStatusException("You can't add an end match event because match is already finished", 'ReportStatus', ReportStatus.FINISHED)
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
        return new ReportStatusException("You can't remove a start match event because match is already finished", 'ReportStatus', ReportStatus.FINISHED)
      }
      case new EndMatchEvent().type: {
        return ReportStatus.STARTED
      }
      default:
        return null
    }
  }

}

module.exports = FinishedStatus
