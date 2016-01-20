import PouchDB from 'pouchdb'
PouchDB.plugin(require('pouchdb-find'))

let db = new PouchDB('mobile')
db.sync('http://localhost:5984/mobile', {live: true})
window.PouchDB = PouchDB

let GenericService = {

  /**
   * Returns the database
   * @returns {Object} The database object
   */
  getDatabase: function () {
    return db
  },

  /**
   * Callback to return an element
   * @callback genericCallback
   * @param {Object} element - An object.
   * @param {Object} err - An error object.
   */

  /**
    * Get an object by Id
    * @param {Number} id The object identifier
    * @param {genericCallback} callback A callback that returns an object
    */
  findById: function (id, callback) {
    db.get(id).then(function (doc) {
      callback(doc, null)
    }).catch(function (err) {
      console.log('err: ', err)
      callback(null, err)
    })
  },

  /**
    * Add a new object in the DB
    * @param {Object} object The new object to be added
    * @param {genericCallback} callback A callback that returns the object if it's added
    */
  create: function (object, callback) {
    db.post(object).then(function (response) {
      db.allDocs({key: response.id, include_docs: true}).then(function (doc) {
        let value = null
        if (doc.rows.length > 0) {
          value = doc.rows[0].doc
        }
        callback(value, null)
      })
    }).catch(function (err) {
      console.log('err: ', err)
      callback(null, err)
    })
  },

  /**
    * Update an object in the DB
    * @param {Object} object The object to be updated
    * @param {genericCallback} callback A callback that returns the object if it's updated
    */
  update: function (object, callback) {
    db.put(object).then(function (response) {
      db.allDocs({key: response.id, include_docs: true}).then(function (doc) {
        let value = null
        if (doc.rows.length > 0) {
          value = doc.rows[0].doc
        }
        callback(value, null)
      })
    }).catch(function (err) {
      console.log('err: ', err)
      callback(null, err)
    })
  },

  /**
    * Remove an object in the DB
    * @param {Object} object The object to be removed
    * @param {genericCallback} callback A callback that returns the object if it's updated
    */
  remove: function (object, callback) {
    db.remove(object).then(function (result) {
      callback(result, null)
    }).catch(function (err) {
      console.log('err: ', err)
      callback(null, err)
    })
  }
}

module.exports = GenericService
