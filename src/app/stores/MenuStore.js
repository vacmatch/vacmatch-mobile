//
// Copyright (c) 2016 by VACmatch
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//

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
