import Reflux from 'reflux'

import MenuActions from '../actions/MenuActions'

let MenuStore = Reflux.createStore({
  listenables: MenuActions,

  init: function () {
    this.state = {
      resetLeftMenuFunction: null,
      leftMenu: {
        icon: '',
        action: '',
        elements: []
      },
      rightMenu: []
    }
  },

  getInitialState: function () {
    return this.state
  },

  onSetRightMenu: function (items) {
    // item -> text, url, callback
    if (items.length !== 0) {
      // Check if each item exists or not in the menu
      let filteredElements = []
      items.map(item => {
        let foundElement = this.state.rightMenu.find(
          e => e === item
        )
        if (foundElement === undefined) {
          filteredElements.push(item)
        }
      })
      this.state.rightMenu = this.state.rightMenu.concat(filteredElements)
      this.trigger(this.state)
    }
  },

  onClearRightMenu: function () {
    this.state.rightMenu = []
    this.trigger(this.state)
  },

  onSetLeftMenu: function (icon, actionFunction, elements) {
    this.state.leftMenu = {
      icon: icon,
      action: actionFunction,
      elements: elements
    }
    this.trigger(this.state)
  },

  onSetResetLeftMenuFunction: function (action) {
    this.state.resetLeftMenuFunction = action
    this.trigger(this.state)
  },

  onResetLeftMenu: function () {
    this.state.resetLeftMenuFunction()
  }
})

module.exports = MenuStore
