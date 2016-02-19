import PouchDB from 'pouchdb'
PouchDB.plugin(require('pouchdb-authentication'))

import Hashes from 'jshashes'

var db = new PouchDB('http://localhost:5984/_users')

let AuthService = {

  /**
   * Callback to return an element in User Service
   * @callback userCallback
   * @param {Object} element - A User object.
   * @param {Object} err - An error object.
   */

  /**
   * Login a User and returns an error if login fails
   * @param {String} username The username
   * @param {String} password The password
   * @param {userCallback} callback A callback that returns an User or error
   */
  login: function (username, password, callback) {
    db.login(username, password, (err, response) => {
      if (err !== null) {
        console.log('err: ', err)
        callback(username, err)
      } else {
        this.getUser(username, callback)
      }
    })
  },

  /**
   * Logout a User and returns an error if logout fail
   * @param {userCallback} callback A callback that returns an object with response or error
   */
  logout: function (callback) {
    db.logout(function (err, response) {
      if (err !== null) {
        console.log('err: ', err)
        callback(null, err)
      } else {
        callback(response, null)
      }
    })
  },

  /**
   * Signup a new User and returns an error if signup fail
   * @param {String} username The username
   * @param {String} password The password
   * @param {String} firstName The User first name
   * @param {String} surname The User surname
   * @param {String} cardId The User card identification
   * @param {String} signKey The User sign key
   * @param {userCallback} callback A callback that returns a User or error
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
        console.log('err: ', err)
        callback(username, err)
      }
      this.getUser(username, callback)
    })
  },

  /**
   * Get a User from de DB by Username
   * @param {String} username The username
   * @param {userCallback} callback A callback that returns a User or error
   */
  getUser: function (username, callback) {
    db.getUser(username, function (err, response) {
      if (err !== null) {
        console.log('err: ', err)
        callback(username, err)
      } else {
        callback(response, err)
      }
    })
  },

  /**
   * Get a User from de DB by id
   * @param {String} userId The User identifier
   * @param {userCallback} callback A callback that returns a User or error
   */
  findById: function (userId, callback) {
    db.get(userId).then(function (doc) {
      callback(doc, null)
    }).catch(function (err) {
      console.log('err: ', err)
      callback(null, err)
    })
  },

  /**
   * Check if signKey si valid, return a boolean value
   * @param {String} userId The User identifier
   * @param {String} signKey The User sign key
   * @param {userCallback} callback A callback that returns a Boolean value or error
   */
  checkSignKey: function (userId, signKey, callback) {
    this.findById(userId, (user, err) => {
      if (err !== null) {
        callback(user, err)
      } else {
        let value = false
        value = (user.signKey === new Hashes.SHA512().hex(signKey))
        callback(value, err)
      }
    })
  }
}

module.exports = AuthService
