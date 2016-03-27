import InvalidParametersException from '../models/exception/InvalidParametersException'
import AuthDao from '../daos/AuthDao'

import Hashes from 'jshashes'

class AuthService {

  constructor (refereeService) {
    this.RefereeService = refereeService
  }

  /**
   * Login a User and returns an error if login fails
   * @param {String} username The username
   * @param {String} password The password
   * @param {userCallback} callback A callback that returns an User or error
   */
  login (username, password, callback) {
    AuthDao.login(username, password, callback)
  }

  /**
   * Logout a User and returns an error if logout fail
   * @param {userCallback} callback A callback that returns an object with response or error
   */
  logout (callback) {
    AuthDao.logout(callback)
  }

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
  doSignUp (username, password, avatarUrl, email, firstName, surname, cardId, signKey, callback) {
    AuthDao.signup(username, password, avatarUrl, email, firstName, surname, cardId, signKey, callback)
  }

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
  signup (username, password, secondPassword, avatarUrl, email, firstName, surname, cardId, signKey, secondSignKey, callback) {
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
        return callback(response, err)
      }
      // Create Referee if signup was ok
      this.RefereeService.create(firstName, cardId, avatarUrl, response.id, (referee, err) => {
        if (err !== null) {
          this.deleteUser(response.id, function (resp, error) {
            callback(referee, err)
          })
        } else {
          callback(response, err)
        }
      })
    })
  }

  /**
  * Get a User from de DB by id
  * @param {String} userId The User identifier
  * @param {userCallback} callback A callback that returns a User or error
  */
  findById (userId, callback) {
    AuthDao.findById(userId, callback)
  }

  /**
   * Get a User from de DB by Username
   * @param {String} username The username
   * @param {userCallback} callback A callback that returns a User or error
   */
  getUser (username, callback) {
    AuthDao.getUser(username, callback)
  }

  /**
   * Check if signKey si valid, return a boolean value
   * @param {String} userId The User identifier
   * @param {String} signKey The User sign key
   * @param {userCallback} callback A callback that returns a Boolean value or error
   */
  checkSignKey (userId, signKey, callback) {
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

  /**
   * Delete a User from de DB by id if it exists
   * @param {String} userId The user identifier
   * @param {userCallback} callback A callback that returns an ok response or error
   */
  deleteUser (userId, callback) {
    this.findById(userId, function (user, err) {
      if (err !== null) {
        console.log('err: ', err)
        callback(userId, err)
      } else {
        AuthDao.deleteUser(user, callback)
      }
    })
  }

}

module.exports = AuthService
