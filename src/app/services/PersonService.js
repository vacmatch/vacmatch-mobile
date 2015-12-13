import PouchDB from 'pouchdb'

var db = new PouchDB('players')

let PersonService = {

  /**
    * Get an unique Person from a team in this report
    */
  findByPersonIdReportIdAndTeamId: function (personId, reportId, teamId, callback) {
    db.createIndex({
      index: {fields: ['id', 'reportId', 'teamId']}
    }).then(function () {
      return db.find({
        selector: {
          id: {$eq: personId},
          reportId: {$eq: reportId},
          teamId: {$eq: teamId}
        }
      })
    }).then(function (result) {
      callback(result.docs, null)
    }).catch(function (err) {
      console.log('err: ', err)
      callback(null, err)
    })
  },

  /**
    * Get a list of People from a team in this report
    */
  findByReportIdAndTeamId: function (reportId, teamId, callback) {
    db.createIndex({
      index: {fields: ['reportId', 'teamId']}
    }).then(function () {
      return db.find({
        selector: {
          reportId: {$eq: reportId},
          teamId: {$eq: teamId}
        }
      })
    }).then(function (result) {
      callback(result.docs, null)
    }).catch(function (err) {
      console.log('err: ', err)
      callback(null, err)
    })
  },

  /**
    * Create a new Person
    */
  save: function (name, cardId, dorsal, avatarUrl, isCalled, reportId, teamId, userId, callback) {
    let person = {
      name: name,
      cardId: cardId,
      dorsal: dorsal,
      avatarUrl: avatarUrl,
      isCalled: isCalled,
      reportId: reportId,
      teamId: teamId,
      userId: userId
    }
    db.post(person).then(function (response) {
      db.allDocs({key: response.id, include_docs: true}).then(function (doc) {
        callback(doc.rows[0], null)
      })
    }).catch(function (err) {
      console.log('err: ', err)
      callback(null, err)
    })
  }

}

module.exports = PersonService
