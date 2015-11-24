import PouchDB from 'pouchdb'

var db = new PouchDB('reports')

let ReportService = {

  find: function (id, callback) {
    db.allDocs({key: id, include_docs: true}).then(function (doc) {
      callback(doc.rows[0])
    })
  },

  findAll: function (callback) {
    db.allDocs({include_docs: true}).then(function (doc) {
      callback(doc)
    })
  },

  save: function (report, callback) {
    db.post(report).then(function (response) {
      db.allDocs({key: response.id, include_docs: true}).then(function (doc) {
        callback(doc.rows[0], null)
      })
    }).catch(function (err) {
      console.log('err: ', err)
      callback(null, err)
    })
  },

  delete: function (id, callback) {
    db.get(id).then(function (doc) {
      return db.remove(doc)
    }).then(function (result) {
      callback(result, null)
    }).catch(function (err) {
      console.log('err: ', err)
      callback(null, err)
    })
  }
}

module.exports = ReportService
