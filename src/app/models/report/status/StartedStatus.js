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
