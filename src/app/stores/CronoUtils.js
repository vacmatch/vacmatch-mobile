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


let CronoUtils = {
  // Parse crono string and convert it to milisecond
  stringToMiliseconds: function (time) {
    let elements = time.split(':')
    return (parseInt(elements[0], 10) * 60000) + (parseInt(elements[1], 10) * 1000)
  },

  // Create crono string from milisecond
  milisecondsToString: function (miliseconds) {
    let date = new Date(miliseconds)
    return (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() +
      ':' + (date.getSeconds() < 10 ? '0' : '') + date.getSeconds()
  }
}

module.exports = CronoUtils
