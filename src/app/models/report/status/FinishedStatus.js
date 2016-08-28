//
// Copyright (c) 2016 by VACmatch
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//

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
