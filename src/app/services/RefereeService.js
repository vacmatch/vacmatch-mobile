import PouchDB from 'pouchdb'

var db = new PouchDB('referees')
db.sync('http://localhost:5984/referees', {live: true})

let RefereeService = {

  /**
    * Get an unique Referee
    */
  findByRefereeId: function (refereeId, callback) {
    db.get(refereeId).then(function (doc) {
      callback(doc, null)
    }).catch(function (err) {
      console.log('err: ', err)
      callback(null, err)
    })
  },

  /**
    * Save a referee
    */
  save: function (referee, callback) {
    db.put(referee).then(function (response) {
      db.allDocs({key: response.id, include_docs: true}).then(function (doc) {
        callback(doc.rows[0].doc, null)
      })
    }).catch(function (err) {
      console.log('err: ', err)
      callback(null, err)
    })
  },

  /**
    * Create a new referee
    */
  create: function (name, cardId, avatarUrl, userId, callback) {
    this.getLastId((id) => {
      let referee = {
        _id: id.toString(),
        name: name,
        cardId: cardId,
        avatarUrl: avatarUrl,
        userId: userId
        // TODO: Add federation id
      }
      // Save it
      this.save(referee, callback)
    })
  },

  /**
    * Get last Referee identifier
    */
  getLastId: function (callback) {
    db.allDocs({limit: 0}).then(function (doc) {
      callback(doc.total_rows)
    })
  }
}

module.exports = RefereeService
