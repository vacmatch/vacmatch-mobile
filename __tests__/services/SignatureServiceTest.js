jest.dontMock('../../src/app/services/SignService')
jest.dontMock('../../src/app/services/AuthService')
jest.dontMock('../../src/app/services/ReportService')
jest.dontMock('../../src/app/services/PersonService')
jest.dontMock('../../src/app/services/TeamService')

// Services
let SignService = require('../../src/app/services/SignService')
let AuthService = require('../../src/app/services/AuthService')
let ReportService = require('../../src/app/services/ReportService')
let PersonService = require('../../src/app/services/PersonService')
let TeamService = require('../../src/app/services/TeamService')

let Signature = require('../../src/app/models/signature/Signature')
let User = require('../../src/app/models/user/User')
let Team = require('../../src/app/models/team/Team')
let Report = require('../../src/app/models/report/Report')
let InstanceNotFoundException = require('../../src/app/models/exception/InstanceNotFoundException')

let SignDao = require('../../src/app/daos/SignDao')

// Default elements
let defaultSignature = null
let defaultUser = null
let defaultTeam = null
let defaultReport = null
let reportService = null
let teamService = null
let authService = null
let personService = null
let signService = null

describe('Create Signature', function () {

  beforeEach(function () {
    defaultSignature = new Signature(null, 'userid', 'reortId', 'hash', 'time', 'identifier', 'name', 'teamId', 'fedId')
    defaultUser = new User(null, 'username', 'pass', 'www.avatarurl.test', 'test@email.com', 'Fulano', 'De tal', '22222222Z', 'signkey')
    defaultTeam = new Team(null, 'Team name')
    defaultReport = new Report('report', '', '', false, defaultTeam, defaultTeam, [])
    authService = new AuthService(jasmine.createSpy('RefereeService'))
    reportService = new ReportService(jasmine.createSpy('PersonService'), jasmine.createSpy('TeamService'), jasmine.createSpy('EventService'), jasmine.createSpy('SignService'))
    personService = new PersonService(jasmine.createSpy('ReportService'), jasmine.createSpy('TeamService'), jasmine.createSpy('AuthService'))
    teamService = new TeamService()
    signService = new SignService(authService, reportService, personService, teamService)
  })

  it('A new Signature should be created if user, report, person and team exists', function () {
    let signature = defaultSignature
    let user = defaultUser
    let report = defaultReport
    let team = defaultTeam

    spyOn(authService, 'findById').andCallFake(function (anyUserId, callback) {
      callback(user, null)
    })

    spyOn(reportService, 'findById').andCallFake(function (anyReportId, callback) {
      callback(report, null)
    })

    spyOn(personService, 'findByPersonIdReportIdAndTeamId').andCallFake(function (anyPersonId, anyReportId, anyTeamId, callback) {
      callback(team, null)
    })

    spyOn(teamService, 'findById').andCallFake(function (anyTeamId, callback) {
      callback(team, null)
    })

    spyOn(SignDao, 'create').andCallFake(function (userId, reportId, stringToHash, timeStamp, personId, name, teamId, fedId, callback) {
      callback(signature, null)
    })

    signService.create(signature.userId, signature.reportId, signature.hash, signature.timeStamp,
      signature.identifier, signature.name, signature.teamId, signature.fedId, function (sign, err) {
        expect(sign).toEqual(signature)
        expect(sign).not.toBe(null)
        expect(err).toBe(null)
    })

    expect(authService.findById).toHaveBeenCalled()
    expect(reportService.findById).toHaveBeenCalled()
    expect(personService.findByPersonIdReportIdAndTeamId).toHaveBeenCalled()
    expect(teamService.findById).toHaveBeenCalled()
    expect(SignDao.create).toHaveBeenCalled()

  })

  it('A new Signature cant be created if user doesnt exist', function () {
    let signature = defaultSignature

    let error = new InstanceNotFoundException('User not found', 'userId', signature.userId)

    spyOn(authService, 'findById').andCallFake(function (anyUserId, callback) {
      callback(null, error)
    })

    spyOn(reportService, 'findById')

    spyOn(personService, 'findByPersonIdReportIdAndTeamId')

    spyOn(teamService, 'findById')

    signService.create(signature.userId, signature.reportId, signature.hash, signature.timeStamp,
      signature.identifier, signature.name, signature.teamId, signature.fedId, function (sign, err) {
        expect(err).toEqual(error)
        expect(err).not.toBe(null)
        expect(sign).toBe(null)
    })

    expect(authService.findById).toHaveBeenCalled()
    expect(reportService.findById).not.toHaveBeenCalled()
    expect(personService.findByPersonIdReportIdAndTeamId).not.toHaveBeenCalled()
    expect(teamService.findById).not.toHaveBeenCalled()
  })

  it('A new Signature cant be created if report doesnt exist', function () {
    let signature = defaultSignature
    let user = defaultUser

    let error = new InstanceNotFoundException('Report not found', 'reportId', signature.reportId)

    spyOn(authService, 'findById').andCallFake(function (anyUserId, callback) {
      callback(user, null)
    })

    spyOn(reportService, 'findById').andCallFake(function (anyReportId, callback) {
      callback(null, error)
    })

    spyOn(personService, 'findByPersonIdReportIdAndTeamId')

    spyOn(teamService, 'findById')

    signService.create(signature.userId, signature.reportId, signature.hash, signature.timeStamp,
      signature.identifier, signature.name, signature.teamId, signature.fedId, function (sign, err) {
        expect(err).toEqual(error)
        expect(err).not.toBe(null)
        expect(sign).toBe(null)
    })

    expect(authService.findById).toHaveBeenCalled()
    expect(reportService.findById).toHaveBeenCalled()
    expect(personService.findByPersonIdReportIdAndTeamId).not.toHaveBeenCalled()
    expect(teamService.findById).not.toHaveBeenCalled()
  })

  it('A new Signature cant be created if person doesnt exist', function () {
    let signature = defaultSignature
    let user = defaultUser
    let report = defaultReport

    let error = new InstanceNotFoundException('Report not found', 'reportId', signature.reportId)

    spyOn(authService, 'findById').andCallFake(function (anyUserId, callback) {
      callback(user, null)
    })

    spyOn(reportService, 'findById').andCallFake(function (anyReportId, callback) {
      callback(report, null)
    })

    spyOn(personService, 'findByPersonIdReportIdAndTeamId').andCallFake(function (anyPersonId, anyReportId, anyTeamId, callback) {
      callback(null, error)
    })

    spyOn(teamService, 'findById')

    signService.create(signature.userId, signature.reportId, signature.hash, signature.timeStamp,
      signature.identifier, signature.name, signature.teamId, signature.fedId, function (sign, err) {
        expect(err).toEqual(error)
        expect(err).not.toBe(null)
        expect(sign).toBe(null)
    })

    expect(authService.findById).toHaveBeenCalled()
    expect(reportService.findById).toHaveBeenCalled()
    expect(personService.findByPersonIdReportIdAndTeamId).toHaveBeenCalled()
    expect(teamService.findById).not.toHaveBeenCalled()
  })

  it('A new Signature cant be created if team doesnt exist', function () {
    let signature = defaultSignature
    let user = defaultUser
    let report = defaultReport
    let team = defaultTeam

    let error = new InstanceNotFoundException('Report not found', 'reportId', signature.reportId)

    spyOn(authService, 'findById').andCallFake(function (anyUserId, callback) {
      callback(user, null)
    })

    spyOn(reportService, 'findById').andCallFake(function (anyReportId, callback) {
      callback(report, null)
    })

    spyOn(personService, 'findByPersonIdReportIdAndTeamId').andCallFake(function (anyPersonId, anyReportId, anyTeamId, callback) {
      callback(team, null)
    })

    spyOn(teamService, 'findById').andCallFake(function (anyTeamId, callback) {
      callback(null, error)
    })

    signService.create(signature.userId, signature.reportId, signature.hash, signature.timeStamp,
      signature.identifier, signature.name, signature.teamId, signature.fedId, function (sign, err) {
        expect(err).toEqual(error)
        expect(err).not.toBe(null)
        expect(sign).toBe(null)
    })

    expect(authService.findById).toHaveBeenCalled()
    expect(reportService.findById).toHaveBeenCalled()
    expect(personService.findByPersonIdReportIdAndTeamId).toHaveBeenCalled()
    expect(teamService.findById).toHaveBeenCalled()

  })

})

describe('Delete Signature', function () {

  beforeEach(function () {
    defaultSignature = new Signature(null, 'userid', 'reortId', 'hash', 'time', 'identifier', 'name', 'teamId', 'fedId')
    signService = new SignService()
  })

  it('A signature should be deleted if it exists', function () {
    let signature = defaultSignature

    spyOn(signService, 'findById').andCallFake(function (existentSignatureId, callback) {
      callback(signature, null)
    })

    spyOn(SignDao, 'deleteSignature').andCallFake(function (signature, callback) {
      callback(jasmine.any(Object), null)
    })

    signService.delete(signature._id, function (sign, err) {
      expect(sign).toEqual(signature)
      expect(sign).not.toBe(null)
      expect(err).toBe(null)
    })

    expect(signService.findById).toHaveBeenCalled()
    expect(SignDao.deleteSignature).toHaveBeenCalled()

  })

  it('A signature cant be deleted if it doesnt exist', function () {
    let signature = defaultSignature

    let error = new InstanceNotFoundException('Signature not found', 'signId', signature._id)

    spyOn(signService, 'findById').andCallFake(function (existentSignatureId, callback) {
      callback(null, error)
    })

    spyOn(SignDao, 'deleteSignature')

    signService.delete(signature._id, function (sign, err) {
      expect(err).toEqual(error)
      expect(err).not.toBe(null)
      expect(sign).toBe(null)
    })

    expect(signService.findById).toHaveBeenCalled()
    expect(SignDao.deleteSignature).not.toHaveBeenCalled()

  })
})
