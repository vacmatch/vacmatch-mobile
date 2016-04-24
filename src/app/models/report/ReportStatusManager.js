import ReadyStatus from './status/ReadyStatus'
import StartedStatus from './status/StartedStatus'
import FinishedStatus from './status/FinishedStatus'
import ReportStatus from './ReportStatus'

let ReportStatusManager = {

  isInitialized: false,
  _statusMap: [],

  constructor () {
    this._statusMap = new Map([
      [ReportStatus.READY, new ReadyStatus()], [ReportStatus.STARTED, new StartedStatus()], [ReportStatus.FINISHED, new FinishedStatus()]
    ])
    this.isInitialized = true
  },

  getStatusFromType (type) {
    if (!this.isInitialized) {
      this.constructor()
    }
    return this._statusMap.get(type)
  }

}

module.exports = ReportStatusManager
