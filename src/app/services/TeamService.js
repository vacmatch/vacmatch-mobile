import PouchDB from 'pouchdb'
PouchDB.plugin(require('pouchdb-find'))

var db = new PouchDB('events')
db.sync('http://localhost:5984/events', {live: true})

let EventService = {

  save: function (teamName, callback) {
    this.getLastId(function (id) {
      let element = {
        '_id': id.toString(),
        'teamName': teamName
      }
      db.put(element).then(function (response) {
        db.allDocs({key: response.id, include_docs: true}).then(function (doc) {
          callback(doc.rows[0].doc, null)
        })
      }).catch(function (err) {
        console.log('err: ', err)
        callback(null, err)
      })
    })
  },

  getLastId: function (callback) {
    db.allDocs({limit: 0}).then(function (doc) {
      callback(doc.total_rows)
    })
  },

  findById: function (teamId, callback) {
    db.get(teamId).then(function (doc) {
      callback(doc, null)
    }).catch(function (err) {
      console.log('err: ', err)
      callback(null, err)
    })
  },

  deleteTeam: function (teamId, callback) {
    this.findById(teamId, function (data, err) {
      // Remove it
      db.remove(data, function () {
        callback(data, err)
      })
    })
  }
}

module.exports = EventService
