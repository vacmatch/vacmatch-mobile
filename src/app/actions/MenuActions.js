import Reflux from 'reflux'

let MenuActions = Reflux.createActions([
  'setRightMenu',
  'setLeftMenu',
  'setResetLeftMenuFunction',
  'resetLeftMenu',
  'clearRightMenu'
])

module.exports = MenuActions
