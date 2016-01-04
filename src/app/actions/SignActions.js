import Reflux from 'reflux'

let SignActions = Reflux.createActions([
  'updateSignatures',
  'userSignReport',
  'nonUserSignReport'
])

module.exports = SignActions
