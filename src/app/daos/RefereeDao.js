import GenericDao from './GenericDao'
import Referee from '../models/referee/Referee'

let RefereeDao = {

  databaseType: 'referee',

  findById: function (refereeId, callback) {
    GenericDao.findById(refereeId, callback)
  },

  findByUserId: function (userId, callback) {
    let db = GenericDao.getDatabase()
    db.createIndex({
      index: {fields: ['databaseType', 'userId']}
    }).then(function () {
      return db.find({
        selector: {
          databaseType: {$eq: this.databaseType},
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

  create: function (name, cardId, avatarUrl, userId, callback) {
    let referee = new Referee(null, name, cardId, avatarUrl, userId)
    // Save it
    GenericDao.create(referee, callback)
  }

}

module.exports = RefereeDao
