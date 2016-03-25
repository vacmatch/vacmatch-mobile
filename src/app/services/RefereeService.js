import RefereeDao from '../daos/RefereeDao'

let RefereeService = {

  /**
   * Get a Referee from de DB by id
   * @param {String} refereeId The Referee identifier
   * @param {refereeCallback} callback A callback that returns a Referee or error
   */
  findById: function (refereeId, callback) {
    RefereeDao.findById(refereeId, callback)
  },

  /**
   * Find a unique Referee by userId
   * TODO: Add federationId when federation feature is added
   * @param {String} userId The User identifier
   * @param {refereeCallback} callback A callback that returns a Referee or error
   */
  findByUserId: function (userId, callback) {
    RefereeDao.findByUserId(userId, callback)
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
    RefereeDao.create(name, cardId, avatarUrl, userId, callback)
  }

}

module.exports = RefereeService
