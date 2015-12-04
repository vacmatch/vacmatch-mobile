import PouchDB from 'pouchdb'
PouchDB.plugin(require('pouchdb-find'))

var db = new PouchDB('events')

let EventService = {

  save: function (reportId, eventType, matchTime, cause, timestamp, callback) {
    this.getLastId(function (id) {
      let element = {
        '_id': id.toString(),
        'reportId': reportId,
        'type': eventType,
        'matchTime': matchTime,
        'text': cause,
        'timestamp': timestamp
        // TODO: Add user which create the event
      }
      db.put(element).then(function (response) {
        db.allDocs({key: response.id, include_docs: true}).then(function (doc) {
          callback(doc.rows[0], null)
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

  findAllByReportID: function (reportId, callback) {
    db.createIndex({
      index: {fields: ['reportId']}
    }).then(function () {
      return db.find({
        selector: {reportId: {$eq: reportId}}
      })
    }).then(function (result) {
      callback(result.docs)
    })
  },

  findAllByReportIdAndEventType: function (reportId, eventType, callback) {
    db.createIndex({
      index: {fields: ['reportId', 'type']}
    }).then(function () {
      return db.find({
        selector: {
          reportId: {$eq: reportId},
          type: {$eq: eventType}
        }
      })
    }).then(function (result) {
      callback(result)
    })
  }

}

module.exports = EventService
