//
// Copyright (c) 2016 by VACmatch
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//

import PouchDB from 'pouchdb'
import Exception from '../models/exception/Exception'
PouchDB.plugin(require('pouchdb-find'))

import config from '../api/config'
let remoteUrl = 'http://' + config[config._env].db.username + ':' + config[config._env].db.password +
  '@' + config[config._env].db.host + ':' + config[config._env].db.port + '/' + config[config._env].db.urls.generic

var db = new PouchDB('mobile')
db.sync(remoteUrl, {live: true})

window.PouchDB = PouchDB

let GenericDao = {

  getDatabase: function () {
    return db
  },

  /**
    * Get an object by Id
    * @param {String} id The object identifier
    * @param {genericCallback} callback A callback that returns an object
    */
  findById: function (id, callback) {
    db.get(id).then(function (doc) {
      return callback(doc, null)
    }).catch(function (err) {
      console.log('err: ', err)
      callback(id, err)
    })
  },

  /**
    * Add a new object in the DB
    * @param {Object} object The new object to be added
    * @param {genericCallback} callback A callback that returns the object if it's added
    */
  create: function (object, callback) {
    if (object.databaseType === null || object.databaseType === undefined) {
      return callback(null, new Exception('Object with no type', 'object', object))
    }
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
      callback(object, err)
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
      callback(object, err)
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
      callback(object, err)
    })
  }
}

module.exports = GenericDao
