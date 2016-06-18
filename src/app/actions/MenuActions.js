import Reflux from 'reflux'

let MenuActions = Reflux.createActions([
  'setRightMenu',
  'addActionFunction',
  'setLeftMenu',
  'clearRightMenu'
])

module.exports = MenuActions
