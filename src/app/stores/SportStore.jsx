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

import Soccer from '../models/web/sport/Soccer'

import SportActions from '../actions/SportActions'

let SportStore = Reflux.createStore({
  listenables: SportActions,

  init: function () {
    this.state = new Soccer()
  },

  getInitialState: function () {
    return this.state
  },

  onUpdateSport: function (newSport) {
    this.state = newSport
    this.trigger(this.state)
  }

})

module.exports = SportStore
