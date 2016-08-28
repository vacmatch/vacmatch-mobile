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
import Referee from '../models/referee/Referee'
import InstanceNotFoundException from '../models/exception/InstanceNotFoundException'

let RefereeDao = {

  databaseType: 'referee',

  findById: function (refereeId, callback) {
    GenericDao.findById(refereeId, callback)
  },

  findByUserId: function (userId, callback) {
    let db = GenericDao.getDatabase()
    db.createIndex({
      index: {fields: ['databaseType', 'userId']}
    }).then(() => {
      return db.find({
        selector: {
          databaseType: {$eq: this.databaseType},
          userId: {$eq: userId}
        }
      })
    }).then(function (result) {
      let value = null
      if (result.docs.length > 0) {
        value = result.docs[0]
        callback(value, null)
      } else {
        callback(null, new InstanceNotFoundException('This user is not a referee', 'userId', userId))
      }
    }).catch(function (err) {
      console.log('err: ', err)
      callback(userId, err)
    })
  },

  create: function (name, cardId, avatarUrl, userId, callback) {
    let referee = new Referee(null, name, cardId, avatarUrl, userId)
    // Save it
    GenericDao.create(referee, callback)
  }

}

module.exports = RefereeDao
