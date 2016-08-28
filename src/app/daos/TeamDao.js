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

import GenericDao from './GenericDao'
import Team from '../models/team/Team'

let TeamDao = {

  databaseType: 'team',

  findById: function (teamId, callback) {
    GenericDao.findById(teamId, callback)
  },

  create: function (teamName, callback) {
    let team = new Team(null, teamName)
    // Save it
    GenericDao.create(team, callback)
  },

  deleteTeam: function (team, callback) {
    GenericDao.remove(team, callback)
  }
}

module.exports = TeamDao
