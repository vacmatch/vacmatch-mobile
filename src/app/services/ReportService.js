import PouchDB from 'pouchdb'

var db = new PouchDB('reports')

let ReportService = {

  find: function (id, callback) {
    db.allDocs({key: id, include_docs: true}).then(function (docs) {
      callback(docs.rows[0].doc)
    })
  },

  findAll: function (callback) {
    db.allDocs({include_docs: true}).then(function (doc) {
      callback(doc)
    })
  },

  findAllByFinished: function (hasFinished, callback) {
    db.createIndex({
      index: {fields: ['hasFinished']}
    }).then(function () {
      return db.find({
        selector: {
          hasFinished: {$eq: hasFinished}
        }
      })
    }).then(function (result) {
      callback(result.docs, null)
    }).catch(function (err) {
      console.log('err: ', err)
      callback(null, err)
    })
  },

  save: function (date, location, hasFinished, localTeam, visitorTeam, callback) {
    let report = {
      date: date,
      location: location,
      hasFinished: hasFinished,
      localTeam: {
        id: localTeam.id,
        teamName: localTeam.teamName,
        result: localTeam.result,
        secondaryField: localTeam.secondaryField
      },
      visitorTeam: {
        id: visitorTeam.id,
        teamName: visitorTeam.teamName,
        result: visitorTeam.result,
        secondaryField: visitorTeam.secondaryField
      }
    }
    db.post(report).then(function (response) {
      db.allDocs({key: response.id, include_docs: true}).then(function (doc) {
        callback(doc.rows[0], null)
      })
    }).catch(function (err) {
      console.log('err: ', err)
      callback(null, err)
    })
  },

  update: function (reportId, date, hasFinished, location, localTeam, visitorTeam, callback) {
    this.find(reportId, (element) => {
      element.date = date
      element.location = location
      element.hasFinished = hasFinished
      element.localTeam.id = localTeam.id
      element.localTeam.teamName = localTeam.teamName
      element.localTeam.result = localTeam.result
      element.localTeam.secondaryField = localTeam.secondaryField
      element.visitorTeam.id = visitorTeam.id
      element.visitorTeam.teamName = visitorTeam.teamName
      element.visitorTeam.result = visitorTeam.result
      element.visitorTeam.secondaryField = visitorTeam.secondaryField

      db.put(element).then(function (response) {
        db.allDocs({key: response.id, include_docs: true}).then(function (docs) {
          callback(docs.rows[0].doc, null)
        })
      }).catch(function (err) {
        console.log('err: ', err)
        callback(null, err)
      })
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
