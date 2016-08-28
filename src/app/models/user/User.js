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

import RefereeUserType from '../web/user/RefereeUserType'

class User {

  constructor (id, username, password, avatarUrl, email, firstName, lastName, cardId, signKey) {
    this.id_ = id
    this.databaseType = 'user'
    this.username = username
    this.password = password
    this.avatarUrl = avatarUrl
    this.email = email
    this.firstName = firstName
    this.lastName = lastName
    this.cardId = cardId
    this.signKey = signKey
    this.userType = RefereeUserType.type
  }

}

module.exports = User
