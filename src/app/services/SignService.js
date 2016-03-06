import GenericService from './GenericService'
import Signature from '../models/signature/Signature'

import Hashes from 'jshashes'

let SignStore = {

  /**
   * Returns the type of this service
   * @returns {String} The type identifier
   */
  getType: function () {
    return 'signature'
  },

  /**
   * Callback to return lists in Signature Service
   * @callback signatureListCallback
   * @param {Object[]} list - A Signature list.
   * @param {Object} err - An error object.
   */

  /**
   * Callback to return an element in Signature Service
   * @callback signatureCallback
   * @param {Object} element - A Signature object.
   * @param {Object} err - An error object.
   */

  /**
   * Find a Signature by id
   * @param {Number} signId Sinature identifier
   * @param {signatureCallback} callback A callback that returns the Signature element or error
   */
  findById: function (signId, callback) {
    GenericService.findById(signId, callback)
  },

  /**
   * Find all Signatures in a Report by report id
   * @param {Number} reportId Report identifier
   * @param {signatureListCallback} callback A callback that returns the Signature list
   */
  findAllByReportId: function (reportId, callback) {
    let db = GenericService.getDatabase()
    db.createIndex({
      index: {fields: ['timeStamp', 'reportId']}
    }).then(function () {
      return db.find({
        selector: {
          timeStamp: {$exists: true},
          reportId: {$eq: reportId}
        },
        sort: [
          {'timeStamp': 'desc'},
          {'reportId': 'asc'}
        ]
      })
    }).then(function (result) {
      callback(result.docs, null)
    }).catch(function (err) {
      console.log('err: ', err)
      callback(null, err)
    })
  },

  /**
   * Create a Signature
   * @param {String} userId User identifier that creates the signature
   * @param {String} reportId Report identifier which is signed
   * @param {String} stringToHash A text with information about the game to create a checksum
   * @param {Number} timeStamp The time when the Report is signed
   * @param {String} personId The signer Person identifier
   * @param {String} name The signer Person name
   * @param {String} teamId The Team from the signer Person
   * @param {String} fedId The Federation id from the signer Person (null if the signer is not an User)
   * @param {signatureCallback} callback A callback that returns the created Signature or error
   */
  create: function (userId, reportId, stringToHash, timeStamp, personId, name, teamId, fedId, callback) {
    let hash = new Hashes.SHA512().hex(stringToHash)
    let signature = new Signature(this.getType(), userId, reportId, hash, timeStamp, personId, name, teamId, fedId)
    // Save it
    GenericService.create(signature, callback)
  },

  /**
   * Delete a Signature
   * @param {String} signId Signature identifier
   * @param {signatureCallback} callback A callback that returns an object with
   * the deleted signId if the Signature was deleted
   */
  delete: function (signId, callback) {
    this.findById(signId, function (signature, err) {
      if (err === null) {
        // Remove it
        GenericService.remove(signature, callback)
      } else {
        callback(null, err)
      }
    })
  },

  /**
   * Delete all Signature from a Report
   * @param {String} reportId Report identifier
   * @param {signatureCallback} callback A callback that returns if Signatures were removed
   */
  deleteAllSignaturesByReportId: function (reportId, callback) {
    this.findAllByReportId(reportId, function (signatureList, err) {
      signatureList.map((sign) => {
        this.delete(sign._id, function (res, err) {
          if (err !== null) {
            return callback(null, err)
          }
        })
      })
      callback(signatureList, err)
    })
  }
}

module.exports = SignStore
