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

import RefereeDao from '../daos/RefereeDao'

class RefereeService {

  constructor (authService) {
    this.AuthService = authService
  }

  /**
   * Get a Referee from de DB by id
   * @param {String} refereeId The Referee identifier
   * @param {refereeCallback} callback A callback that returns a Referee or error
   */
  findById (refereeId, callback) {
    RefereeDao.findById(refereeId, callback)
  }

  /**
   * Find a unique Referee by userId
   * TODO: Add federationId when federation feature is added
   * @param {String} userId The User identifier
   * @param {refereeCallback} callback A callback that returns a Referee or error
   */
  findByUserId (userId, callback) {
    RefereeDao.findByUserId(userId, callback)
  }

  /**
   * Create a new Referee
   * TODO: Add federationId when federation feature is added
   * @param {String} name The Referee name
   * @param {String} cardId The Referee carId
   * @param {String} avatarUrl The Referee avatar url
   * @param {String} userId The User identifier
   * @param {refereeCallback} callback A callback that returns a Referee if it was created or error
   */
  create (name, cardId, avatarUrl, userId, callback) {
    this.AuthService.findById(userId, function (data, err) {
      if (err !== null) {
        return callback(data, err)
      }
      RefereeDao.create(name, cardId, avatarUrl, userId, callback)
    })
  }

}

module.exports = RefereeService
