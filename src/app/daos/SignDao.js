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
