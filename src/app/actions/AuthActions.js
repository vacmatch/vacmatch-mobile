import Reflux from 'reflux'

let AuthActions = Reflux.createActions([
  'logIn',
  'logOut',
  'signUp'
])

module.exports = AuthActions
