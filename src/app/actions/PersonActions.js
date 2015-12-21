import Reflux from 'reflux'

let PersonActions = Reflux.createActions([
  'addPerson',
  'toggleCallPerson',
  'updatePersonDorsal',
  'updatePerson',
  'editPerson'
])

module.exports = PersonActions
