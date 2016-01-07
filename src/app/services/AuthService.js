import PouchDB from 'pouchdb'
PouchDB.plugin(require('pouchdb-authentication'))

import Hashes from 'jshashes'

var db = new PouchDB('http://localhost:5984/_users')

// Create a local users database and sync the remote database
let localdb = new PouchDB('localUsers')
db.sync(localdb, {live: true})

let AuthService = {

  /*
   * Login a user and returns an error if login fail
   */
  login: function (username, password, callback) {
    db.login(username, password, (err, response) => {
      if (err !== null) {
        console.log(err)
        callback(null, err)
      } else {
        this.getUser(username, callback)
      }
    })
  },

  /*
  * Logout a user and returns an error if logout fail
   */
  logout: function (callback) {
    db.logout(function (err, response) {
      if (err !== null) {
        console.log(err)
        callback(null, err)
      } else {
        callback(response, null)
      }
    })
  },

  /*
  * Signup a new user and returns an error if signup fail
   */
  signup: function (username, password, email, firstName, surname, cardId, signKey, callback) {
    let hashKey = new Hashes.SHA512().hex(signKey)
    db.signup(username, password, {
      metadata: {
        email: email,
        firstName: firstName,
        surname: surname,
        cardId: cardId,
        signKey: hashKey
      }
    }, (err, response) => {
      if (err !== null) {
        console.log(err)
        callback(null, err)
      }
      this.getUser(username, callback)
    })
  },

  /*
  * Get a user from de DB by Username
   */
  getUser: function (username, callback) {
    db.getUser(username, function (err, response) {
      if (err !== null) {
        console.log(err)
        callback(null, err)
      } else {
        callback(response, err)
      }
    })
  },

  /* -----------------------------------------------------------
  * ------------------- LOCAL DB FUNCTIONS --------------------
  * -----------------------------------------------------------
  */

  /*
   * Get user from DB by ID
   * TODO: Work offline
   */
  findById: function (userId, callback) {
    db.get(userId).then(function (doc) {
      callback(doc, null)
    }).catch(function (err) {
      console.log('err: ', err)
      callback(null, err)
    })
  },

  /*
   * Check if signKey si valid, return a boolean value
   */
  checkSignKey: function (userId, signKey, callback) {
    this.findById(userId, (user, err) => {
      let value = false
      if (err === null) {
        value = (user.signKey === new Hashes.SHA512().hex(signKey))
      }
      callback(value, err)
    })
  }
}

module.exports = AuthService
