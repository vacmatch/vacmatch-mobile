import GenericDao from './GenericDao'
import Person from '../models/person/Person'

let PersonDao = {

  databaseType: 'person',

  findByPersonIdReportIdAndTeamId: function (personId, reportId, teamId, callback) {
    let db = GenericDao.getDatabase()
    db.createIndex({
      index: {fields: ['_id', 'reportId', 'teamId']}
    }).then(function () {
      return db.find({
        selector: {
          _id: {$eq: personId},
          reportId: {$eq: reportId},
          teamId: {$eq: teamId}
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
      callback(null, err)
    })
  },

  findByReportIdAndTeamId: function (reportId, teamId, callback) {
    let db = GenericDao.getDatabase()
    db.createIndex({
      index: {fields: ['databaseType', 'reportId', 'teamId']}
    }).then(() => {
      return db.find({
        selector: {
          databaseType: {$eq: this.databaseType},
          reportId: {$eq: reportId},
          teamId: {$eq: teamId}
        }
      })
    }).then(function (result) {
      callback(result.docs, null)
    }).catch(function (err) {
      console.log('err: ', reportId, teamId, err)
      callback(null, err)
    })
  },

  findAllByReportId: function (reportId, callback) {
    let db = GenericDao.getDatabase()
    db.createIndex({
      index: {fields: ['databaseType', 'reportId', 'teamId']}
    }).then(() => {
      return db.find({
        selector: {
          databaseType: {$eq: this.databaseType},
          reportId: {$eq: reportId}
        }
      })
    }).then(function (result) {
      callback(result.docs, null)
    }).catch(function (err) {
      console.log('err: ', reportId, err)
      callback(null, err)
    })
  },

  create: function (name, cardId, dorsal, avatarUrl, isCalled, isStaff, reportId, teamId, userId, callback) {
    let person = new Person(null, name, cardId, dorsal, avatarUrl, isCalled, isStaff, reportId, teamId, userId)
    // Save it
    GenericDao.create(person, callback)
  },

  update: function (personId, name, cardId, dorsal, avatarUrl, isCalled, isStaff, reportId, oldTeamId, teamId, userId, oldPerson, callback) {
    oldPerson.name = name
    oldPerson.cardId = cardId
    oldPerson.dorsal = dorsal
    oldPerson.avatarUrl = avatarUrl
    oldPerson.isCalled = isCalled
    oldPerson.isStaff = isStaff
    oldPerson.reportId = reportId
    oldPerson.teamId = teamId
    oldPerson.userId = userId
    // Save it
    GenericDao.update(oldPerson, callback)
  },

  setCalledValue: function (personId, reportId, teamId, newValue, oldPerson, callback) {
    oldPerson.isCalled = newValue
    // Update it
    GenericDao.update(oldPerson, callback)
  },

  setDorsal: function (personId, reportId, teamId, newDorsal, oldPerson, callback) {
    oldPerson.dorsal = newDorsal
    // Update it
    GenericDao.update(oldPerson, callback)
  },

  deletePerson: function (person, callback) {
    GenericDao.remove(person, callback)
  }

}

module.exports = PersonDao
