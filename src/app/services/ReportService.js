import InstanceNotFoundException from '../models/exception/InstanceNotFoundException'
import ReportDao from '../daos/ReportDao'

class ReportService {

  constructor (personService, teamService, eventService, signService) {
    this.PersonService = personService
    this.TeamService = teamService
    this.EventService = eventService
    this.SignService = signService
  }

  /**
   * Find a Report by id
   * @param {String} reportId Report identifier
   * @param {reportCallback} callback A callback that returns the Report element or error
   */
  findById (reportId, callback) {
    ReportDao.findById(reportId, callback)
  }

  /**
    * Find finished Reports
    * @param {Boolean} hasFinished Check if the game was finished and a EndGame event was added or not
    * @param {reportListCallback} callback A callback that returns the a list of Reports
    */
  findAllByFinished (hasFinished, callback) {
    ReportDao.findAllByFinished(hasFinished, callback)
  }

  /**
    * Create a Report
    * @param {String} date A string with the date when the game is played
    * @param {String} location The place where the game is played
    * @param {Boolean} hasFinished Check if the game was finished and a EndGame event was added or not
    * @param {Object} localTeam The team which is local in the game
    * @param {Object} visitorTeam The team which is visitor in the game
    * @param {String} refereeList The list with all referees assigned to this game
    * @param {reportCallback} callback A callback that returns the created Report or error
    */
  create (date, location, hasFinished, localTeam, visitorTeam, refereeList, callback) {
    // Create a new local team
    this.TeamService.create(localTeam.name, (local, err) => {
      if (err !== null) {
        return callback(null, err)
      }
      localTeam._id = local._id
      // Create a new visitor team
      this.TeamService.create(visitorTeam.name, (visitor, err) => {
        if (err !== null) {
          return callback(null, err)
        }
        visitorTeam._id = visitor._id
        // Create it
        ReportDao.create(date, location, hasFinished, localTeam, visitorTeam, refereeList, callback)
      })
    })
  }

  /**
    * Update a Report
    * @param {String} reportId The report identifier
    * @param {String} date A string with the date when the game is played
    * @param {String} location The place where the game is played
    * @param {Boolean} hasFinished Check if the game was finished and a EndGame event was added or not
    * @param {Object} localTeam The team which is local in the game
    * @param {Object} visitorTeam The team which is visitor in the game
    * @param {String} incidences Text field to write incidences and other information in the game
    * @param {reportCallback} callback A callback that returns the updated Report or error
    */
  update (reportId, date, location, hasFinished, localTeam, visitorTeam, incidences, callback) {
    // Check if report exists
    this.findById(reportId, (oldReport, err) => {
      if (err !== null) {
        return callback(null, err)
      }
      // Check if localTeam exists
      this.TeamService.findById(localTeam._id, (lt, err) => {
        if (err !== null) {
          return callback(null, new InstanceNotFoundException('Non existent local team', 'report.localTeam._id', localTeam._id))
        }
        // Check if visitorTeam exists
        this.TeamService.findById(visitorTeam._id, (vt, err) => {
          if (err !== null) {
            return callback(null, new InstanceNotFoundException('Non existent visitor team', 'report.visitorTeam._id', visitorTeam._id))
          }
          // Save it
          ReportDao.update(reportId, date, location, hasFinished, localTeam, visitorTeam, incidences, oldReport, callback)
        })
      })
    })
  }

  /**
    * Delete a Report by identifier
    * It delete all Events, Person, Teams an Signatures from this Report too
    * @param {String} reportId, The Report identifier
    * @param {reportCallback} callback A callback that returns an object with
    * the deleted reportId if the report was deleted
    */
  delete (reportId, callback) {
    this.findById(reportId, (report, err) => {
      if (err !== null) {
        return callback(null, new InstanceNotFoundException('Non existent report', 'reportId', reportId))
      }
      this.EventService.deleteAllEventsByReportId(reportId, (res, err) => {
        this.PersonService.deleteAllPersonByReportId(reportId, (res, err) => {
          this.TeamService.delete(report.localTeam._id, (res, err) => {
            this.TeamService.delete(report.visitorTeam._id, (res, err) => {
              this.SignService.deleteAllSignaturesByReportId(reportId, (res, err) => {
                ReportDao.delete(report, callback)
              })
            })
          })
        })
      })
    })
  }
}

module.exports = ReportService
