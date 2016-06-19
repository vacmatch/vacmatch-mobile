import GenericDao from './GenericDao'
import Report from '../models/report/Report'
import InstanceNotFoundException from '../models/exception/InstanceNotFoundException'
import config from '../api/config'

let ReportDao = {

  databaseType: 'report',

  _filterByUserId: function (userId, reportList) {
    // In development mode, userId is not necessary
    if ((config._env === 'development') && (userId === null)) {
      return reportList
    }
    // Check for each report if this user is in the Referee list and return filtered reports for this user
    return reportList.filter((report) => {
      let referee = ((report.refereeList.find((referee) => {
        return (referee !== null && referee.userId === userId)
      })))
      return referee !== null && referee !== undefined
    })
  },

  findById: function (userId, reportId, callback) {
    GenericDao.findById(reportId, (report, err) => {
      let list = [report]
      let result = this._filterByUserId(userId, list)
      if (result.length > 0) {
        callback(report, null)
      } else {
        callback(null, new InstanceNotFoundException('Non existent report for this user', 'reportId-userId', reportId + '-' + userId))
      }
    })
  },

  findAllByStatus: function (userId, status, callback) {
    let db = GenericDao.getDatabase()
    db.createIndex({
      index: {fields: ['databaseType', 'status']}
    }).then(() => {
      return db.find({
        selector: {
          databaseType: {$eq: this.databaseType},
          status: {$eq: status}
        }
      })
    }).then((result) => {
      let reports = this._filterByUserId(userId, result.docs)
      callback(reports, null)
    }).catch((err) => {
      console.log('err: ', err)
      callback(status, err)
    })
  },

  create: function (date, location, status, localTeam, visitorTeam, refereeList, callback) {
    // Create the new report
    let report = new Report(null, date, location, status, localTeam, visitorTeam, refereeList)
    GenericDao.create(report, callback)
  },

  update: function (userId, reportId, date, location, status, localTeam, visitorTeam, incidences, oldReport, callback) {
    let list = [oldReport]
    let result = this._filterByUserId(userId, list)
    if (result.length > 0) {
      oldReport.date = date
      oldReport.location = location
      oldReport.status = status
      oldReport.localTeam._id = localTeam._id
      oldReport.localTeam.name = localTeam.name
      oldReport.localTeam.result = localTeam.result
      oldReport.localTeam.secondaryField = localTeam.secondaryField
      oldReport.visitorTeam._id = visitorTeam._id
      oldReport.visitorTeam.name = visitorTeam.name
      oldReport.visitorTeam.result = visitorTeam.result
      oldReport.visitorTeam.secondaryField = visitorTeam.secondaryField
      oldReport.incidences = incidences
      // Save it
      GenericDao.update(oldReport, callback)
    } else {
      callback(null, new InstanceNotFoundException('Non existent report for this user', 'reportId-userId', reportId + '-' + userId))
    }
  },

  delete: function (userId, report, callback) {
    let list = [report]
    let result = this._filterByUserId(userId, list)
    if (result.length > 0) {
      // Remove Report
      GenericDao.remove(report, callback)
    } else {
      callback(null, new InstanceNotFoundException('Non existent report for this user', 'reportId-userId', report._id + '-' + userId))
    }
  }
}

module.exports = ReportDao
