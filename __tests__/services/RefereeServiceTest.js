jest.dontMock('../../src/app/services/RefereeService')

// Services
let genericService = require('../../src/app/services/GenericService')
let authService = require('../../src/app/services/AuthService')
let refereeService = require('../../src/app/services/RefereeService')

let User = require('../../src/app/models/user/User')
let Referee = require('../../src/app/models/referee/Referee')
let InstanceNotFoundException = require('../../src/app/models/exception/InstanceNotFoundException')

// Default elements
let defaultUser = null
let defaultReferee = null

describe('Create Referee', function () {

  beforeEach(function () {
    defaultUser = new User(1, 'user', 'username', 'pass', 'www.avatarurl.test', 'test@email.com', 'Fulano', 'De tal', '22222222Z', 'signkey')
    defaultReferee = new Referee(null, 'referee', 'name', '22222222Z', 'www.avatarurl.test', '1')
  })

  it('A new Referee can be created if User exists', function () {
    let referee = defaultReferee
    let user = defaultUser

    spyOn(authService, 'findById').andCallFake(function (anyUserId, callback) {
      callback(user, null)
    })

    spyOn(genericService, 'create').andCallFake(function (anyReferee, callback) {
      callback(referee, null)
    })

    refereeService.create(referee.name, referee.cardId, referee.avatarUrl, referee.userId, function (referee, err) {
      expect(referee).toEqual(referee)
      expect(referee).not.toBe(null)
      expect(err).toBe(null)
    })

    expect(authService.findById).toHaveBeenCalled()

    expect(genericService.create).toHaveBeenCalled()

  })

  it('A new Referee cant be created if User doesnt exist', function () {
    let referee = defaultReferee

    let error = new InstanceNotFoundException('User not found', 'userId', referee.userId)

    spyOn(authService, 'findById').andCallFake(function (anyUserId, callback) {
      callback(null, error)
    })

    spyOn(genericService, 'create')

    refereeService.create(referee.name, referee.cardId, referee.avatarUrl, referee.userId, function (referee, err) {
      expect(err).not.toBe(null)
      expect(err).toEqual(error)
      expect(referee).toBe(null)
    })

    expect(authService.findById).toHaveBeenCalled()

    expect(genericService.create).not.toHaveBeenCalled()

  })

})
