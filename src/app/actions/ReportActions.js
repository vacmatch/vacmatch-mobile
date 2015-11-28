import Reflux from 'reflux'

let ReportActions = Reflux.createActions([
  'updateLists',
  'addReport',
  'deleteReport',
  'updateReportTeams',
  'updateTime',
  'resetTime',
  'updateTerm',
  'updatePlayers'
])

module.exports = ReportActions
