import Reflux from 'reflux'

import MenuActions from '../actions/MenuActions'

let MenuStore = Reflux.createStore({
  listenables: MenuActions,

  init: function () {
    this.state = {
      leftMenu: {
        icon: '',
        actionType: '',
        action: '',
        elements: [],
        avaliablesActions: new Map()
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

  onAddActionFunction: function (actionName, actionFunction, callback) {
    this.state.leftMenu.avaliablesActions.set(actionName, actionFunction)
    this.trigger(this.state)
    callback()
  },

  onSetLeftMenu: function (icon, actionFunctionName, elements) {
    // Add the new action
    let actionFunction = this.state.leftMenu.avaliablesActions.get(actionFunctionName)
    // Set actual values
    this.state.leftMenu = {
      icon: icon,
      actionType: actionFunctionName,
      action: actionFunction,
      elements: elements,
      avaliablesActions: this.state.leftMenu.avaliablesActions
    }
    this.trigger(this.state)
  }

})

module.exports = MenuStore
