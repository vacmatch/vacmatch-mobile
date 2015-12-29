import PouchDB from 'pouchdb'
PouchDB.plugin(require('pouchdb-authentication'))

var db = new PouchDB('http://localhost:5984/users')

let AuthService = {

  login: function (username, password, callback) {
    db.login(username, password, function (err, response) {
      if (err) {
        console.log(err)
        if (err.name === 'unauthorized') {
          callback(null, err)
          // name or password incorrect
        } else {
          callback(null, err)
          // cosmic rays, a meteor, etc.
        }
      } else {
        console.log('Logued', username, password)
        callback(response, null)
      }
    })
  },

  logout: function () {
    db.logout(function (err, response) {
      if (err) {
        console.log(err)
        // network error
      }
    })
  },

  signup: function (username, password, email, firstName, surname, cardId, callback) {
    db.signup(username, password, {
      metadata: {
        email: email,
        firstName: firstName,
        surname: surname,
        cardId: cardId
      }
    }, function (err, response) {
      if (err) {
        console.log(err)
        if (err.name === 'conflict') {
          // "batman" already exists, choose another username
        } else if (err.name === 'forbidden') {
          // invalid username
        } else {
          // HTTP error, cosmic rays, etc.
        }
      } else {
        console.log('Signed up', username, password)
        this.login(username, password, callback)
      }
    })
  },

  getUser: function (username) {
    db.getUser(username, function (err, response) {
      if (err) {
        console.log(err)
        if (err.name === 'not_found') {
          // typo, or you don't have the privileges to see this user
        } else {
          // some other error
        }
      } else {
        console.log(response)
        // response is the user object
      }
    })
  }
}

module.exports = AuthService
