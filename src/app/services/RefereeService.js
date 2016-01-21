import GenericService from './GenericService'
import Referee from '../models/referee/Referee'

let RefereeService = {

  /**
   * Returns the type of this service
   * @returns {String} The type identifier
   */
  getType: function () {
    return 'referee'
  },

  /**
   * Callback to return an element in Referee Service
   * @callback refereeCallback
   * @param {Object} element - A Referee object.
   * @param {Object} err - An error object.
   */

  /**
   * Get a Referee from de DB by id
   * @param {String} refereeId The Referee identifier
   * @param {refereeCallback} callback A callback that returns a Referee or error
   */
  findById: function (refereeId, callback) {
    GenericService.findById(refereeId, callback)
  },

  /**
   * Find a unique Referee by userId
   * TODO: Add federationId when federation feature is added
   * @param {String} userId The User identifier
   * @param {refereeCallback} callback A callback that returns a Referee or error
   */
  findByUserId: function (userId, callback) {
    let db = GenericService.getDatabase()
    db.createIndex({
      index: {fields: ['userId']}
    }).then(function () {
      return db.find({
        selector: {
          userId: {$eq: userId}
        }
      })
    }).then(function (result) {
      let value = null
      if (result.docs.length > 0) {
        value = result.docs[0]
      }
      callback(value, null)
    }).catch(function (err) {
      console.log('err: ', err)
      callback(userId, err)
    })
  },

  /**
   * Create a new Referee
   * TODO: Add federationId when federation feature is added
   * @param {String} name The Referee name
   * @param {String} cardId The Referee carId
   * @param {String} avatarUrl The Referee avatar url
   * @param {String} userId The User identifier
   * @param {refereeCallback} callback A callback that returns a Referee if it was created or error
   */
  create: function (name, cardId, avatarUrl, userId, callback) {
    let referee = new Referee(this.getType(), name, cardId, avatarUrl, userId)
    // Save it
    GenericService.create(referee, callback)
  }

}

module.exports = RefereeService
