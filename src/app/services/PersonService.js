import PouchDB from 'pouchdb'

var db = new PouchDB('players')

let PersonService = {

  /**
    * Get an unique Person from a team in this report
    */
  findByPersonIdReportIdAndTeamId: function (personId, reportId, teamId, callback) {
    db.createIndex({
      index: {fields: ['_id', 'reportId', 'teamId']}
    }).then(function () {
      return db.find({
        selector: {
          _id: {$eq: personId},
          reportId: {$eq: reportId},
          teamId: {$eq: teamId}
        }
      })
    }).then(function (result) {
      callback(result.docs[0], null)
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
      console.log('err: ', reportId, teamId, err)
      callback(null, err)
    })
  },

  /**
    * Update a Person
    */
  save: function (person, callback) {
    db.put(person).then(function (response) {
      db.allDocs({key: response.id, include_docs: true}).then(function (doc) {
        callback(doc.rows[0].doc, null)
      })
    }).catch(function (err) {
      console.log('err: ', err)
      callback(null, err)
    })
  },

  /**
    * Create a new Person
    */
  create: function (name, cardId, dorsal, avatarUrl, isCalled, reportId, teamId, userId, callback) {
    this.getLastId((id) => {
      let person = {
        _id: id.toString(),
        name: name,
        cardId: cardId,
        dorsal: dorsal,
        avatarUrl: avatarUrl,
        isCalled: isCalled,
        reportId: reportId,
        teamId: teamId,
        userId: userId
      }
      // Save it
      this.save(person, function (data, err) {
        callback(data, err)
      })
    })
  },

  /**
    * Set a new value to isCalled property
    */
  setCalledValue: function (personId, reportId, teamId, newValue, callback) {
    // Get person
    this.findByPersonIdReportIdAndTeamId(personId, reportId, teamId, (person, err) => {
      person.isCalled = newValue
      this.save(person, function (data, err) {
        callback(data, err)
      })
    })
  },

  /**
    * Set a new value to dorsal property
    */
  setDorsal: function (personId, reportId, teamId, newDorsal, callback) {
    // Get person
    this.findByPersonIdReportIdAndTeamId(personId, reportId, teamId, (person, err) => {
      person.dorsal = newDorsal
      this.save(person, function (data, err) {
        callback(data, err)
      })
    })
  },

  /**
    * Get number of documents in the DB to use it as next Person identifier
    */
  getLastId: function (callback) {
    db.allDocs({limit: 0}).then(function (doc) {
      callback(doc.total_rows)
    })
  }
}

module.exports = PersonService
