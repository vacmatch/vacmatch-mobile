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
import DuplicateException from '../models/exception/DuplicateException'
import GenericDao from './GenericDao'

PouchDB.plugin(require('pouchdb-authentication'))

import config from '../api/config'

let url = 'http://' + config[config._env].db.username + ':' + config[config._env].db.password +
  '@' + config[config._env].db.host + ':' + config[config._env].db.port + '/' + config[config._env].db.urls.auth
let db = new PouchDB(url)

let AuthDao = {

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

  signup: function (username, password, avatarUrl, email, firstName, surname, cardId, signKey, callback) {
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
        if (err === 'conflict') {
          return callback(null, new DuplicateException('Username is been used', 'username', username))
        } else {
          return callback(null, err)
        }
      }
      callback(response, err)
    })
  },

  findById: function (userId, callback) {
    db.get(userId).then(function (doc) {
      callback(doc, null)
    }).catch(function (err) {
      console.log('err: ', err)
      callback(null, err)
    })
  },

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

  deleteUser: function (user, callback) {
    GenericDao.remove(user, callback)
  }

}

module.exports = AuthDao
