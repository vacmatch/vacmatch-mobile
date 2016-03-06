import GenericService from './GenericService'
import ReportService from './ReportService'
import TeamService from './TeamService'
import AuthService from './AuthService'
import Person from '../models/person/Person'
import InstanceNotFoundException from '../models/exception/InstanceNotFoundException'

let PersonService = {

  /**
   * Returns the type of this service
   * @returns {String} The type identifier
   */
  getType: function () {
    return 'person'
  },

  /**
   * Callback to return lists in Person Service
   * @callback personListCallback
   * @param {Object[]} list - A Person list.
   * @param {Object} err - An error object.
   */

  /**
   * Callback to return an element in Person Service
   * @callback personCallback
   * @param {Object} element - A Person object.
   * @param {Object} err - An error object.
   */

  /**
    * Get an unique Person from a team in this report
    * @param {String} personId The person identifier
    * @param {String} reportId The report identifier
    * @param {String} teamId The team identifier
    * @param {personCallback} callback A callback that returns an element
    */
  findByPersonIdReportIdAndTeamId: function (personId, reportId, teamId, callback) {
    let db = GenericService.getDatabase()
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

  /**
    * Get a list of People from a team in this report
    * @param {String} reportId The report identifier
    * @param {String} teamId The team identifier
    * @param {personListCallback} callback A callback that returns a list
    */
  findByReportIdAndTeamId: function (reportId, teamId, callback) {
    let db = GenericService.getDatabase()
    db.createIndex({
      index: {fields: ['reportId', 'teamId']}
    }).then(function () {
      return db.find({
        selector: {
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

  /**
    * Get a list of People in a Report
    * @param {String} reportId The report identifier
    * @param {personListCallback} callback A callback that returns a list
    */
  findAllByReportId: function (reportId, callback) {
    let db = GenericService.getDatabase()
    db.createIndex({
      index: {fields: ['reportId', 'teamId']}
    }).then(function () {
      return db.find({
        selector: {
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

  /**
    * Create a new Person
    * @param {String} name The report identifier
    * @param {String} cardId The card identification number
    * @param {String} dorsal The dorsal number
    * @param {String} avatarUrl The url where the avatar is hosted
    * @param {Boolean} isCalled Value that checks if this Person is called by this Team in this Report
    * @param {Boolean} isStaff Value that checks if this Person is a staff
    * @param {String} reportId The report identifier
    * @param {String} teamId The team identifier
    * @param {String} userId The user identifier
    * @param {personCallback} callback A callback that returns an element
    */
  create: function (name, cardId, dorsal, avatarUrl, isCalled, isStaff, reportId, teamId, userId, callback) {
    // Check if the Report exists
    ReportService.findById(reportId, (report, err) => {
      if (err !== null) {
        return callback(null, new InstanceNotFoundException('Non existent report', 'person.reportId', reportId))
      }
      // Check if the Team exists
      TeamService.findById(teamId, (team, err) => {
        if (err !== null) {
          return callback(null, new InstanceNotFoundException('Non existent team', 'person.teamId', teamId))
        }
        // If userId not null, check if User exists
        // userId === null means that this Person that is going to be created is a temporal Person
        if (userId !== null) {
          AuthService.findById(userId, (user, err) => {
            if (err !== null) {
              return callback(null, new InstanceNotFoundException('Non existent user', 'person.userId', userId))
            }
            let person = new Person(null, this.getType(), name, cardId, dorsal, avatarUrl, isCalled, isStaff, reportId, teamId, userId)
            // Save it
            GenericService.create(person, callback)
          })
        } else {
          let person = new Person(null, this.getType(), name, cardId, dorsal, avatarUrl, isCalled, isStaff, reportId, teamId, userId)
          // Save it
          GenericService.create(person, callback)
        }
      })
    })
  },

  /**
    * Update a Person
    * @param {String} personId The Person identifier
    * @param {String} name The report identifier
    * @param {String} cardId The card identification number
    * @param {String} dorsal The dorsal number
    * @param {String} avatarUrl The url where the avatar is hosted
    * @param {Boolean} isCalled Value that checks if this Person is called by this Team in this Report
    * @param {Boolean} isStaff Value that checks if this Person is a staff
    * @param {String} reportId The report identifier
    * @param {String} oldTeamId The old team identifier
    * @param {String} teamId The new team identifier
    * @param {String} userId The user identifier
    * @param {personCallback} callback A callback that returns an element
    */
  update: function (personId, name, cardId, dorsal, avatarUrl, isCalled, isStaff, reportId, oldTeamId, teamId, userId, callback) {
    // Get person
    this.findByPersonIdReportIdAndTeamId(personId, reportId, oldTeamId, (person, err) => {
      if (err === null) {
        person.name = name
        person.cardId = cardId
        person.dorsal = dorsal
        person.avatarUrl = avatarUrl
        person.isCalled = isCalled
        person.isStaff = isStaff
        person.reportId = reportId
        person.teamId = teamId
        person.userId = userId
        // Save it
        GenericService.update(person, callback)
      } else {
        callback(null, new InstanceNotFoundException('Non existent person', 'personId', personId))
      }
    })
  },

  /**
    * Set a new value to isCalled property
    * @param {String} personId The Person identifier
    * @param {String} reportId The report identifier
    * @param {String} teamId The new team identifier
    * @param {Boolean} newValue The new value to isCalled property
    * @param {personCallback} callback A callback that returns an element
    */
  setCalledValue: function (personId, reportId, teamId, newValue, callback) {
    // Get person
    this.findByPersonIdReportIdAndTeamId(personId, reportId, teamId, (person, err) => {
      if (err === null) {
        person.isCalled = newValue
        // Update it
        GenericService.update(person, callback)
      } else {
        callback(null, new InstanceNotFoundException('Non existent person', 'personId', personId))
      }
    })
  },

  /**
    * Set a new value to dorsal property
    * @param {String} personId The Person identifier
    * @param {String} reportId The report identifier
    * @param {String} teamId The new team identifier
    * @param {String} newDorsal The new dorsal value
    * @param {personCallback} callback A callback that returns an element
    */
  setDorsal: function (personId, reportId, teamId, newDorsal, callback) {
    // Get person
    this.findByPersonIdReportIdAndTeamId(personId, reportId, teamId, (person, err) => {
      if (err === null) {
        person.dorsal = newDorsal
        // Update it
        GenericService.update(person, callback)
      } else {
        callback(null, new InstanceNotFoundException('Non existent person', 'personId', personId))
      }
    })
  },

  /**
    * Delete a person indentified by personId, reportId and teamId
    * @param {Number} personId The Person identifier
    * @param {Number} reportId The report identifier
    * @param {Number} teamId The new team identifier
    * @param {personCallback} callback A callback that returns if the delete was correctly
    */
  deletePerson: function (personId, reportId, teamId, callback) {
    this.findByPersonIdReportIdAndTeamId(personId, reportId, teamId, function (person, err) {
      if (err === null) {
        // Remove it
        GenericService.remove(person, callback)
      } else {
        callback(null, new InstanceNotFoundException('Non existent person', 'personId', personId))
      }
    })
  },

  /**
    * Delete all Person from a Report
    * @param {String} reportId The report identifier
    * @param {personCallback} callback A callback that returns if all Person were removed
    */
  deleteAllPersonByReportId: function (reportId, callback) {
    this.findAllByReportId(reportId, function (personList, err) {
      // Remove all person
      personList.map((person) => {
        this.deletePerson(person._id, person.reportId, person.teamId, function (res, err) {
          if (err !== null) {
            return callback(null, err)
          }
        })
      })
      callback(personList, err)
    })
  }

}

module.exports = PersonService
