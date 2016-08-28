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

jest.dontMock('../../src/app/services/RefereeService')

// Services
let AuthService = require('../../src/app/services/AuthService')
let RefereeService = require('../../src/app/services/RefereeService')

let User = require('../../src/app/models/user/User')
let Referee = require('../../src/app/models/referee/Referee')
let InstanceNotFoundException = require('../../src/app/models/exception/InstanceNotFoundException')

let RefereeDao = require('../../src/app/daos/RefereeDao')

// Default elements
let defaultUser = null
let defaultReferee = null
let refereeService = null
let authService = null

describe('Create Referee', function () {

  beforeEach(function () {
    defaultUser = new User(null, 'username', 'pass', 'www.avatarurl.test', 'test@email.com', 'Fulano', 'De tal', '22222222Z', 'signkey')
    defaultReferee = new Referee(null, 'name', '22222222Z', 'www.avatarurl.test', '1')
    authService = new AuthService(jasmine.createSpy("RefereeService"))
    refereeService = new RefereeService(authService)
  })

  it('A new Referee can be created if User exists', function () {
    let referee = defaultReferee
    let user = defaultUser

    spyOn(authService, 'findById').andCallFake(function (anyUserId, callback) {
      callback(user, null)
    })

    spyOn(RefereeDao, 'create').andCallFake(function (name, cardId, avatarUrl, userId, callback) {
      callback(referee, null)
    })

    refereeService.create(referee.name, referee.cardId, referee.avatarUrl, referee.userId, function (referee, err) {
      expect(referee).toEqual(referee)
      expect(referee).not.toBe(null)
      expect(err).toBe(null)
    })

    expect(authService.findById).toHaveBeenCalled()
    expect(RefereeDao.create).toHaveBeenCalled()
  })

  it('A new Referee cant be created if User doesnt exist', function () {
    let referee = defaultReferee

    let error = new InstanceNotFoundException('User not found', 'userId', referee.userId)

    spyOn(authService, 'findById').andCallFake(function (anyUserId, callback) {
      callback(null, error)
    })

    spyOn(RefereeDao, 'create')

    refereeService.create(referee.name, referee.cardId, referee.avatarUrl, referee.userId, function (referee, err) {
      expect(err).not.toBe(null)
      expect(err).toEqual(error)
      expect(referee).toBe(null)
    })

    expect(authService.findById).toHaveBeenCalled()
    expect(RefereeDao.create).not.toHaveBeenCalled()
  })

})
