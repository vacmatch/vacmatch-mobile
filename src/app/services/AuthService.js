import PouchDB from 'pouchdb'
PouchDB.plugin(require('pouchdb-authentication'))

var db = new PouchDB('http://localhost:5984/users')

let AuthService = {

  /*
   * Login a user and returns an error if login fail
   */
  login: function (username, password, callback) {
    db.login(username, password, function (err, response) {
      if (err !== null) {
        console.log(err)
        callback(null, err)
      } else {
        callback(response, null)
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
  signup: function (username, password, email, firstName, surname, cardId, callback) {
    db.signup(username, password, {
      metadata: {
        email: email,
        firstName: firstName,
        surname: surname,
        cardId: cardId
      }
    }, (err, response) => {
      if (err !== null) {
        console.log(err)
        callback(null, err)
      } else {
        this.login(username, password, callback)
      }
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
  }
}

module.exports = AuthService
