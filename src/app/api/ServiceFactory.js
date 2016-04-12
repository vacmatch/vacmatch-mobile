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

    // With No dependencies
    this._signService = new SignService()
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

    this._reportService.PersonService = this._personService
    this._reportService.TeamService = this._teamService
    this._reportService.EventService = this._eventService
    this._reportService.SignService = this._signService

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
