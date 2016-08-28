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

let urls = {
  home: 'home',
  login: {
    show: 'login/'
  },
  report: {
    list: 'reports/',
    show: function (reportId) {
      return 'report/' + reportId
    },
    end: function (reportId) {
      return 'end/report/' + reportId
    }
  },
  call: {
    list: function (reportId) {
      return 'call/report/' + reportId
    }
  },
  event: {
    list: function (reportId) {
      return 'events/' + reportId + '/'
    },
    add: function (reportId, eventType) {
      return 'addEvent/' + reportId + '/' + eventType
    }
  }
}

module.exports = urls
