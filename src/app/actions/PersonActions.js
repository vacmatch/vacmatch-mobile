import Reflux from 'reflux'

let PersonActions = Reflux.createActions([
  'addPerson',
  'toggleCallPerson',
  'updatePersonDorsal'
])

module.exports = PersonActions
