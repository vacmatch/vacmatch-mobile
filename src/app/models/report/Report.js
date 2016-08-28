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

import ReportStatus from './ReportStatus'

class Report {

  constructor (id, date, location, status, localTeam, visitorTeam, refereeList) {
    this._id = id
    this.databaseType = 'report'
    this.date = date
    this.location = location
    this.localTeam = {
      _id: localTeam ? localTeam._id : null,
      name: localTeam ? localTeam.name : '',
      result: localTeam ? localTeam.result : '0',
      secondaryField: localTeam ? localTeam.secondaryField : '0'
    }
    this.visitorTeam = {
      _id: visitorTeam ? visitorTeam._id : null,
      name: visitorTeam ? visitorTeam.name : '',
      result: visitorTeam ? visitorTeam.result : '0',
      secondaryField: visitorTeam ? visitorTeam.secondaryField : '0'
    }
    this.status = status ? status : ReportStatus.READY
    this.incidences = ''
    this.refereeList = refereeList
  }

}

module.exports = Report
