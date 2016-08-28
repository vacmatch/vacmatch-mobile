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

class Signature {

  constructor (id, userId, reportId, hash, timeStamp, identifier, name, teamId, fedId) {
    this._id = id
    this.databaseType = 'signature'
    this.userId = userId
    this.reportId = reportId
    this.hash = hash
    this.timeStamp = timeStamp
    this.identifier = identifier
    this.name = name
    this.teamId = teamId
    this.fedId = fedId
  }

}

module.exports = Signature
