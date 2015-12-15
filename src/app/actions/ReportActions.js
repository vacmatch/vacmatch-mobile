import Reflux from 'reflux'

let ReportActions = Reflux.createActions([
  'updateLists',
  'addReport',
  'deleteReport',
  'updateReport',
  'updateTime',
  'resetTime',
  'updateTerm',
  'updatePlayers',
  'toggleStartMatch',
  'updateResultFields'
])

module.exports = ReportActions
