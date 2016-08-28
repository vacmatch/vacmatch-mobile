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
import Signature from '../models/signature/Signature'

import Hashes from 'jshashes'

let SignDao = {

  databaseType: 'signature',

  findById: function (signId, callback) {
    GenericDao.findById(signId, callback)
  },

  findAllByReportId: function (reportId, callback) {
    let db = GenericDao.getDatabase()
    db.createIndex({
      index: {fields: ['databaseType', 'timeStamp', 'reportId']}
    }).then(() => {
      return db.find({
        selector: {
          databaseType: {$eq: this.databaseType},
          timeStamp: {$exists: true},
          reportId: {$eq: reportId}
        },
        sort: [
          {'databaseType': 'asc'},
          {'timeStamp': 'desc'},
          {'reportId': 'asc'}
        ]
      })
    }).then(function (result) {
      callback(result.docs, null)
    }).catch(function (err) {
      console.log('err: ', err)
      callback(null, err)
    })
  },

  create: function (userId, reportId, stringToHash, timeStamp, personId, name, teamId, fedId, callback) {
    let hash = new Hashes.SHA512().hex(stringToHash)
    let signature = new Signature(null, userId, reportId, hash, timeStamp, personId, name, teamId, fedId)
    // Save it
    GenericDao.create(signature, callback)
  },

  deleteSignature: function (signature, callback) {
    // Remove it
    GenericDao.remove(signature, callback)
  }

}

module.exports = SignDao
