jest.dontMock('../../src/app/services/AuthService')

// Services
let genericService = require('../../src/app/services/GenericService')
let authService = require('../../src/app/services/AuthService')
let refereeService = require('../../src/app/services/RefereeService')

let User = require('../../src/app/models/user/User')
let Referee = require('../../src/app/models/referee/Referee')
let DuplicateException = require('../../src/app/models/exception/DuplicateException')
let InvalidParametersException = require('../../src/app/models/exception/InvalidParametersException')

// Default elements
let defaultUser = null
let defaultReferee = null

describe('Signup', function () {

  beforeEach(function () {
    defaultUser = new User(null, 'username', 'pass', 'www.avatarurl.test' ,'test@email.com', 'Fulano', 'De tal', '22222222Z', 'signkey')
    defaultReferee = new Referee(null, 'name', '22222222Z', 'www.avatarurl.test', 'userid')
  })

  it('A new User cant be signed up if both passwords are diferent', function () {
    let user = defaultUser

    let error = new InvalidParametersException('Passwords are diferent', 'password', user.password)

    // Sign up with different passwords
    authService.signup(user.username, user.password, 'another password', user.avatarUrl, user.email,
      user.firstName, user.surname, user.cardId, user.signKey, user.signKey, function (user, err) {
        expect(err).toEqual(error)
        expect(err).not.toBe(null)
        expect(user).toBe(null)
    })
  })

  it('A new User cant be signed up if password doesnt exist', function () {
    let user = defaultUser
    user.password = undefined

    let error = new InvalidParametersException('Password is not valid', 'password', user.password)

    // Sign up with undefined passwords
    authService.signup(user.username, user.password, user.password, user.avatarUrl, user.email,
      user.firstName, user.surname, user.cardId, user.signKey, user.signKey, function (user, err) {
        expect(err).toEqual(error)
        expect(err).not.toBe(null)
        expect(user).toBe(null)
    })
  })

  it('A new User cant be signed up if password is null', function () {
    let user = defaultUser
    user.password = null

    let error = new InvalidParametersException('Password is not valid', 'password', user.password)

    // Sign up with null passwords
    authService.signup(user.username, user.password, user.password, user.avatarUrl, user.email,
      user.firstName, user.surname, user.cardId, user.signKey, user.signKey, function (user, err) {
        expect(err).toEqual(error)
        expect(err).not.toBe(null)
        expect(user).toBe(null)
    })
  })

  it('A new User cant be signed up if password is empty', function () {
    let user = defaultUser
    user.password = ''

    let error = new InvalidParametersException('Password is not valid', 'password', user.password)

    // Sign up with empty passwords
    authService.signup(user.username, user.password, user.password, user.avatarUrl, user.email,
      user.firstName, user.surname, user.cardId, user.signKey, user.signKey, function (user, err) {
        expect(err).toEqual(error)
        expect(err).not.toBe(null)
        expect(user).toBe(null)
    })
  })

  it('A new User cant be signed up if both sign key are diferent', function () {
    let user = defaultUser

    let error = new InvalidParametersException('Sign keys are diferent', 'signKey', user.signKey)

    // Sign up with differents sign keys
    authService.signup(user.username, user.password, user.password, user.avatarUrl, user.email,
      user.firstName, user.surname, user.cardId, user.signKey, 'different sign key', function (user, err) {
        expect(err).toEqual(error)
        expect(err).not.toBe(null)
        expect(user).toBe(null)
    })
  })

  it('A new User cant be signed up if sign key doesnt exists', function () {
    let user = defaultUser
    user.signKey = undefined

    let error = new InvalidParametersException('Sign key is not valid', 'signKey', user.signKey)

    // Sign up with undefined sign keys
    authService.signup(user.username, user.password, user.password, user.avatarUrl, user.email,
      user.firstName, user.surname, user.cardId, user.signKey, user.signKey, function (user, err) {
        expect(err).toEqual(error)
        expect(err).not.toBe(null)
        expect(user).toBe(null)
    })
  })

  it('A new User cant be signed up if sign key is null', function () {
    let user = defaultUser
    user.signKey = null

    let error = new InvalidParametersException('Sign key is not valid', 'signKey', user.signKey)

    // Sign up with null sign keys
    authService.signup(user.username, user.password, user.password, user.avatarUrl, user.email,
      user.firstName, user.surname, user.cardId, user.signKey, user.signKey, function (user, err) {
        expect(err).toEqual(error)
        expect(err).not.toBe(null)
        expect(user).toBe(null)
    })
  })

  it('A new User cant be signed up if sign key is empty', function () {
    let user = defaultUser
    user.signKey = ''

    let error = new InvalidParametersException('Sign key is not valid', 'signKey', user.signKey)

    // Sign up with empty sign keys
    authService.signup(user.username, user.password, user.password, user.avatarUrl, user.email,
      user.firstName, user.surname, user.cardId, user.signKey, user.signKey, function (user, err) {
        expect(err).toEqual(error)
        expect(err).not.toBe(null)
        expect(user).toBe(null)
    })
  })

  it('A new User cant be signed up if username is been used', function () {
    let user = defaultUser

    let error = new DuplicateException('Username is been used', 'username', user.username)

    spyOn(authService, 'doSignUp').andCallFake(function (username, password, avatarUrl, email, firstName, surname, cardId, hashKey, callback) {
      callback(null, error)
    })

    authService.signup(user.username, user.password, user.password, user.avatarUrl, user.email,
      user.firstName, user.surname, user.cardId, user.signKey, user.signKey, function (user, err) {
        expect(err).toEqual(error)
        expect(err).not.toBe(null)
        expect(user).toBe(null)
    })
  })

  it('A new Referee should be created if the user type is referee, the User was signed up and the new Referee was created', function () {
    let user = defaultUser
    user.userType = 'referee'

    let referee = defaultReferee

    spyOn(authService, 'doSignUp').andCallFake(function (username, password, avatarUrl, email, firstName, surname, cardId, hashKey, callback) {
      callback(jasmine.any(Object), null)
    })

    spyOn(refereeService, 'create').andCallFake(function (firstName, cardId, avatarUrl, userId, callback) {
      callback(referee, null)
    })

    authService.signup(user.username, user.password, user.password, user.avatarUrl, user.email,
      user.firstName, user.surname, user.cardId, user.signKey, user.signKey, function (response, err) {
        expect(response).not.toBe(null)
        expect(err).toBe(null)
    })

    expect(refereeService.create).toHaveBeenCalled()

  })

  it('A new User should be removed if Referee cant be created', function () {
    let user = defaultUser
    user.userType = 'referee'

    let referee = defaultReferee

    spyOn(authService, 'doSignUp').andCallFake(function (username, password, avatarUrl, email, firstName, surname, cardId, hashKey, callback) {
      callback(jasmine.any(Object), null)
    })

    spyOn(refereeService, 'create').andCallFake(function (firstName, cardId, avatarUrl, userId, callback) {
      callback(null, jasmine.any(Object))
    })

    spyOn(authService, 'deleteUser').andCallFake(function (userId, callback) {
      callback(jasmine.any(Object), null)
    })

    authService.signup(user.username, user.password, user.password, user.avatarUrl, user.email,
      user.firstName, user.surname, user.cardId, user.signKey, user.signKey, function (response, err) {
        expect(err).not.toBe(null)
        expect(response).toBe(null)
    })

    expect(refereeService.create).toHaveBeenCalled()

    expect(authService.deleteUser).toHaveBeenCalled()

  })
})
