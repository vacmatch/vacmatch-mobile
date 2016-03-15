import PouchDB from 'pouchdb'
import InvalidParametersException from '../models/exception/InvalidParametersException'
import DuplicateException from '../models/exception/DuplicateException'
import RefereeService from './RefereeService'
import GenericService from './GenericService'

PouchDB.plugin(require('pouchdb-authentication'))

import Hashes from 'jshashes'
import config from '../api/config'

var db = new PouchDB('http://' + config[config._env].db.username + ':' + config[config._env].db.password + '@localhost:5984/_users')

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
   * Signup a new User
   * @param {String} username The username
   * @param {String} password The password
   * @param {String} avatarUrl The User avatar link
   * @param {String} firstName The User first name
   * @param {String} surname The User surname
   * @param {String} cardId The User card identification
   * @param {String} signKey The User sign key
   * @param {userCallback} callback A callback that returns a User or error
   */
  doSignUp: function (username, password, avatarUrl, email, firstName, surname, cardId, signKey, callback) {
    db.signup(username, password, {
      metadata: {
        avatarUrl: avatarUrl,
        email: email,
        firstName: firstName,
        surname: surname,
        cardId: cardId,
        signKey: signKey
      }
    }, (err, response) => {
      if (err !== null) {
        console.log('err: ', err)
      }
      callback(response, err)
    })
  },

  /**
   * Signup a new User, create a Referee and returns an error if signup fail
   * @param {String} username The username
   * @param {String} password The password
   * @param {String} password The password (2º field)
   * @param {String} avatarUrl The User avatar link
   * @param {String} firstName The User first name
   * @param {String} surname The User surname
   * @param {String} cardId The User card identification
   * @param {String} signKey The User sign key
   * @param {String} secondSignKey The User sign key (2º field)
   * @param {userCallback} callback A callback that returns a User or error
   */
  signup: function (username, password, secondPassword, avatarUrl, email, firstName, surname, cardId, signKey, secondSignKey, callback) {
    // Check if both password are the same, exits, null, empty
    if (password !== secondPassword) {
      return callback(null, new InvalidParametersException('Passwords are diferent', 'password', password))
    }
    if ((!password) || (password.length === 0)) {
      return callback(null, new InvalidParametersException('Password is not valid', 'password', password))
    }
    // Check if both signKey are the same, exits, null, empty
    if (signKey !== secondSignKey) {
      return callback(null, new InvalidParametersException('Sign keys are diferent', 'signKey', signKey))
    }
    if ((!signKey) || (signKey.length === 0)) {
      return callback(null, new InvalidParametersException('Sign key is not valid', 'signKey', signKey))
    }
    // Do signup
    let hashKey = new Hashes.SHA512().hex(signKey)
    this.doSignUp(username, password, avatarUrl, email, firstName, surname, cardId, hashKey, (response, err) => {
      if (err !== null) {
        if (err === 'conflict') {
          return callback(null, new DuplicateException('Username is been used', 'username', username))
        } else {
          return callback(null, err)
        }
      }
      // Create Referee if signup was ok
      RefereeService.create(firstName, cardId, avatarUrl, response.id, (referee, err) => {
        if (err !== null) {
          this.deleteUser(response.id, function (resp, error) {
            callback(referee, err)
          })
        } else {
          callback(response, err)
        }
      })
    })
  },

  /**
   * Get a User from de DB by Username
   * @param {String} username The username
   * @param {userCallback} callback A callback that returns a User or error
   */
  getUser: function (username, callback) {
    db.getUser(username, function (err, user) {
      if (err !== null) {
        console.log('err: ', err)
        callback(username, err)
      } else {
        callback(user, err)
      }
    })
  },

  /**
   * Delete a User from de DB by id if it exists
   * @param {String} userId The user identifier
   * @param {userCallback} callback A callback that returns an ok response or error
   */
  deleteUser: function (userId, callback) {
    this.findById(userId, function (user, err) {
      if (err !== null) {
        console.log('err: ', err)
        callback(userId, err)
      } else {
        GenericService.delete(user, callback)
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
