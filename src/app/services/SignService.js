import PouchDB from 'pouchdb'
PouchDB.plugin(require('pouchdb-find'))

import Hashes from 'jshashes'

var db = new PouchDB('signatures')
db.sync('http://localhost:5984/signatures', {live: true})

let SignStore = {

  findById: function (signId, callback) {
    db.get(signId).then(function (doc) {
      callback(doc, null)
    }).catch(function (err) {
      console.log('err: ', err)
      callback(null, err)
    })
  },

  findAllByReportId: function (reportId, callback) {
    console.log(reportId)
    db.createIndex({
      index: {fields: ['timeStamp', 'reportId']}
    }).then(function () {
      return db.find({
        selector: {
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

  save: function (signature, callback) {
    db.post(signature).then(function (response) {
      db.allDocs({key: response.id, include_docs: true}).then(function (doc) {
        callback(doc.rows[0].doc, null)
      })
    }).catch(function (err) {
      console.log('err: ', err)
      callback(null, err)
    })
  },

  create: function (userId, reportId, stringToHash, timeStamp, identifier, name, teamId, fedId, callback) {
    let hash = new Hashes.SHA512().hex(stringToHash)
    this.getLastId((id) => {
      let signature = {
        _id: id.toString(),
        userId: userId,
        reportId: reportId,
        hash: hash,
        timeStamp: timeStamp,
        identifier: identifier,
        name: name,
        teamId: teamId,
        fedId: fedId
      }
      this.save(signature, callback)
    })
  },

  delete: function (signId, callback) {
    this.findById(signId, function (data, err) {
      // Remove it
      db.remove(data, function () {
        callback(data, err)
      })
    })
  },

  /**
    * Get number last document ID
    */
  getLastId: function (callback) {
    db.allDocs({limit: 0}).then(function (doc) {
      callback(doc.total_rows)
    })
  }
}

module.exports = SignStore
