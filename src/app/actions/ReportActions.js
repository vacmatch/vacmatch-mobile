import Reflux from 'reflux'

let ReportActions = Reflux.createActions([
  'updateLists',
  'addReport',
  'deleteReport',
  'updateReportTeams',
  'updateTime',
  'resetTime',
  'updateTerm'
])

module.exports = ReportActions
