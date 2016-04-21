import GenericDao from './GenericDao'
import Report from '../models/report/Report'

let ReportDao = {

  databaseType: 'report',

  findById: function (reportId, callback) {
    GenericDao.findById(reportId, callback)
  },

  findAllByStatus: function (status, callback) {
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
    }).then(function (result) {
      callback(result.docs, null)
    }).catch(function (err) {
      console.log('err: ', err)
      callback(status, err)
    })
  },

  create: function (date, location, status, localTeam, visitorTeam, refereeList, callback) {
    // Create the new report
    let report = new Report(null, date, location, status, localTeam, visitorTeam, refereeList)
    GenericDao.create(report, callback)
  },

  update: function (reportId, date, location, status, localTeam, visitorTeam, incidences, oldReport, callback) {
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
  },

  delete: function (report, callback) {
    // Remove Report
    GenericDao.remove(report, callback)
  }
}

module.exports = ReportDao
