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

import AuthService from '../services/AuthService'
import EventService from '../services/EventService'
import PersonService from '../services/PersonService'
import RefereeService from '../services/RefereeService'
import ReportService from '../services/ReportService'
import SignService from '../services/SignService'
import TeamService from '../services/TeamService'

let ServiceFactory = {

  isInitialized: false,
  _servicesList: new Map(),

  constructor () {
    this._authService = new AuthService()
    this._eventService = new EventService()
    this._personService = new PersonService()
    this._reportService = new ReportService()
    this._refereeService = new RefereeService()
    this._signService = new SignService()

    // With No dependencies
    this._teamService = new TeamService()

    // Inject dependencies
    this._refereeService.AuthService = this._authService

    this._authService.RefereeService = this._refereeService

    this._eventService.ReportService = this._reportService
    this._eventService.PersonService = this._personService
    this._eventService.TeamService = this._teamService

    this._personService.ReportService = this._reportService
    this._personService.TeamService = this._teamService
    this._personService.AuthService = this._authService
    this._personService.EventService = this._eventService

    this._reportService.PersonService = this._personService
    this._reportService.TeamService = this._teamService
    this._reportService.EventService = this._eventService
    this._reportService.SignService = this._signService

    this._signService.AuthService = this._authService
    this._signService.ReportService = this._reportService
    this._signService.PersonService = this._personService
    this._signService.TeamService = this._teamService
    this._signService.RefereeService = this._refereeService

    // Add services to the exposed list
    this._servicesList.set('ReportService', this._reportService)
    this._servicesList.set('PersonService', this._personService)
    this._servicesList.set('RefereeService', this._refereeService)
    this._servicesList.set('TeamService', this._teamService)
    this._servicesList.set('AuthService', this._authService)
    this._servicesList.set('EventService', this._eventService)
    this._servicesList.set('SignService', this._signService)
    this.isInitialized = true
  },

  getService  (type) {
    if (!this.isInitialized) {
      this.constructor()
    }
    let service = this._servicesList.get(type)
    if (!service) {
      console.log('Error getting ', type, ' service')
    }
    return service
  }

}

module.exports = ServiceFactory
