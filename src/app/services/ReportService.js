import GenericService from './GenericService'
import Report from '../models/report/Report'

let ReportService = {

  /**
   * Returns the type of this service
   * @returns {String} The type identifier
   */
  getType: function () {
    return 'report'
  },

  /**
   * Callback to return lists in Report Service
   * @callback reportListCallback
   * @param {Object[]} list - A Report list.
   * @param {Object} err - An error object.
   */

  /**
   * Callback to return an element in Report Service
   * @callback reportCallback
   * @param {Object} element - A Report object.
   * @param {Object} err - An error object.
   */

  /**
   * Find a Report by id
   * @param {Number} reportId Report identifier
   * @param {reportCallback} callback A callback that returns the Report element or error
   */
  findById: function (reportId, callback) {
    GenericService.findById(reportId, callback)
  },

  /**
    * Find finished Reports
    * @param {Boolean} hasFinished Check if the game was finished and a EndGame event was added or not
    * @param {reportListCallback} callback A callback that returns the a list of Reports
    */
  findAllByFinished: function (hasFinished, callback) {
    let db = GenericService.getDatabase()
    db.createIndex({
      index: {fields: ['hasFinished']}
    }).then(function () {
      return db.find({
        selector: {
          hasFinished: {$eq: hasFinished}
        }
      })
    }).then(function (result) {
      callback(result.docs, null)
    }).catch(function (err) {
      console.log('err: ', err)
      callback(null, err)
    })
  },

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
  create: function (date, location, hasFinished, localTeam, visitorTeam, refereeList, callback) {
    let report = new Report(this.getType(), date, location, hasFinished, localTeam, visitorTeam, refereeList)
    // Save it
    GenericService.create(report, callback)
  },

  /**
    * Update a Report
    * @param {Number} reportId The report identifier
    * @param {String} date A string with the date when the game is played
    * @param {String} location The place where the game is played
    * @param {Boolean} hasFinished Check if the game was finished and a EndGame event was added or not
    * @param {Object} localTeam The team which is local in the game
    * @param {Object} visitorTeam The team which is visitor in the game
    * @param {String} incidences Text field to write incidences and other information in the game
    * @param {reportCallback} callback A callback that returns the updated Report or error
    */
  update: function (reportId, date, location, hasFinished, localTeam, visitorTeam, incidences, callback) {
    this.findById(reportId, (report, err) => {
      if (err === null) {
        report.date = date
        report.location = location
        report.hasFinished = hasFinished
        report.localTeam.id = localTeam.id
        report.localTeam.teamName = localTeam.teamName
        report.localTeam.result = localTeam.result
        report.localTeam.secondaryField = localTeam.secondaryField
        report.visitorTeam.id = visitorTeam.id
        report.visitorTeam.teamName = visitorTeam.teamName
        report.visitorTeam.result = visitorTeam.result
        report.visitorTeam.secondaryField = visitorTeam.secondaryField
        report.incidences = incidences
        // Save it
        GenericService.update(report, callback)
      } else {
        callback(null, err)
      }
    })
  },

  /**
    * Delete a Report by identifier
    * @param {Number} id The Report identifier
    * @param {reportCallback} callback A callback that returns an object with
    * the deleted reportId if the report was deleted
    */
  delete: function (id, callback) {
    this.findById(id, function (report, err) {
      if (err === null) {
        // Remove it
        GenericService.remove(report, callback)
      } else {
        callback(null, err)
      }
    })
  }
}

module.exports = ReportService
