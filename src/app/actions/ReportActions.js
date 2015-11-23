import Reflux from 'reflux'

let ReportActions = Reflux.createActions([
  'updateLists',
  'addReport',
  'deleteReport',
  'updateTime',
  'resetTime',
  'updateTerm'
])

module.exports = ReportActions
