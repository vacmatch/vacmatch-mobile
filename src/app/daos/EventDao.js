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

import GenericDao from './GenericDao'
import {Event, ControlEvent} from '../models/event/Event'

let EventDao = {

  databaseType: 'event',

  findById: function (eventId, callback) {
    GenericDao.findById(eventId, callback)
  },

  findAllByReportId: function (reportId, callback) {
    let db = GenericDao.getDatabase()
    db.createIndex({
      index: {fields: ['databaseType', 'timestamp', 'reportId']}
    }).then(() => {
      return db.find({
        selector: {
          databaseType: {$eq: this.databaseType},
          timestamp: {$exists: true},
          reportId: {$eq: reportId}
        },
        sort: [
          {'databaseType': 'desc'},
          {'timestamp': 'desc'},
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

  findAllByReportIdAndEventType: function (reportId, eventType, callback) {
    let db = GenericDao.getDatabase()
    db.createIndex({
      index: {
        fields: ['databaseType', 'timestamp', 'reportId', 'type']
      }
    }).then((result) => {
      return db.find({
        selector: {
          databaseType: {$eq: this.databaseType},
          timestamp: {$exists: true},
          reportId: {$eq: reportId},
          type: {$eq: eventType}
        },
        sort: [
          {'databaseType': 'desc'},
          {'timestamp': 'desc'},
          {'reportId': 'asc'},
          {'type': 'asc'}
        ]
      })
    }).then(function (result) {
      callback(result.docs, null)
    }).catch(function (err) {
      console.log('err: ', err)
      callback(null, err)
    })
  },

  findAllByReportIdAndPersonId: function (reportId, personId, callback) {
    this.findAllByReportId(reportId, (events, err) => {
      if (err !== null) {
        callback(events, err)
      } else {
        let elements = events.filter((value, index, array) => {
          return (value.person) && (value.person._id === personId)
        })
        callback(elements, null)
      }
    })
  },

  create: function (reportId, person, team, eventType, matchTime, cause, timestamp, callback) {
    let event = new Event(null, reportId, person, team, eventType, matchTime, cause, timestamp)
    // Save it
    GenericDao.create(event, callback)
  },

  createControl: function (reportId, eventType, matchTime, text, timestamp, callback) {
    // Create the new event
    let event = new ControlEvent(null, reportId, eventType, matchTime, text, timestamp)
    // Save the event
    GenericDao.create(event, callback)
  },

  deleteEvent: function (event, callback) {
    // Remove the event
    GenericDao.remove(event, callback)
  }

}

module.exports = EventDao
