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

import TeamDao from '../daos/TeamDao'
import InvalidParametersException from '../models/exception/InvalidParametersException'

class TeamService {

  /**
   * Find a Team by id
   * @param {Boolean} teamId Team identifier
   * @param {reportListCallback} callback A callback that returns the Team element or error
   */
  findById (teamId, callback) {
    TeamDao.findById(teamId, callback)
  }

  /**
    * Create a Team
    * @param {String} teamName The name of the new Team
    * @param {teamCallback} callback A callback that returns the created Team or error
    */
  create (teamName, callback) {
    if ((teamName === null) || (teamName === undefined)) {
      return callback(null, new InvalidParametersException('Invalid team name', 'teamName', teamName))
    }
    // Save it
    TeamDao.create(teamName, callback)
  }

  /**
    * Delete a Team
    * @param {String} teamId The Team identifier
    * @param {teamCallback} callback A callback that returns if team was removed
    */
  delete (teamId, callback) {
    this.findById(teamId, function (team, err) {
      if (err !== null) {
        return callback(null, err)
      }
      TeamDao.deleteTeam(team, callback)
    })
  }
}

module.exports = TeamService
