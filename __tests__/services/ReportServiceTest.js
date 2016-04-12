jest.dontMock('../../src/app/services/ReportService')
jest.dontMock('../../src/app/services/TeamService')
jest.dontMock('../../src/app/services/EventService')
jest.dontMock('../../src/app/services/PersonService')
jest.dontMock('../../src/app/services/SignService')

// Services
let ReportService = require('../../src/app/services/ReportService')
let TeamService = require('../../src/app/services/TeamService')
let EventService = require('../../src/app/services/EventService')
let PersonService = require('../../src/app/services/PersonService')
let SignService = require('../../src/app/services/SignService')

let Team = require('../../src/app/models/team/Team')
let Report = require('../../src/app/models/report/Report')
let InstanceNotFoundException = require('../../src/app/models/exception/InstanceNotFoundException')

let ReportDao = require('../../src/app/daos/ReportDao')

// Default elements
let defaultTeam = null
let defaultReport = null
let reportService = null
let teamService = null
let eventService = null
let personService = null
let signService = null

describe('Create Report', function () {

  beforeEach(function () {
    defaultTeam = new Team(null, 'Local team name')
    defaultReport = new Report(null, '', '', false, defaultTeam, defaultTeam, [])
    teamService = new TeamService()
    eventService = new EventService(jasmine.createSpy("ReportService"), jasmine.createSpy("PersonService"), jasmine.createSpy("TeamService"))
    personService = new PersonService(jasmine.createSpy("ReportService"), jasmine.createSpy("TeamService"), jasmine.createSpy("AuthService"))
    signService = new SignService()
    reportService = new ReportService(personService, teamService, eventService, signService)
  })

  it('A new Report should be created and should create a new local and visitor teams', function () {

    let report = defaultReport
    let team = defaultTeam

    spyOn(teamService, 'create').andCallFake(function (anyTeamName, callback) {
      callback(team, null)
    })

    spyOn(ReportDao, 'create').andCallFake(function (date, location, hasFinished, localTeam, visitorTeam, refereeList, callback) {
      callback(report, null)
    })

    reportService.create(report.date, report.location, report.hasFinished, report.localTeam,
      report.visitorTeam, report.refereeList, (p, err) => {
      expect(p).toEqual(report)
      expect(p).not.toBe(null)
      expect(err).toBe(null)
    })

    // It should create local and visitor team (Both)
    expect(teamService.create.calls.length).toEqual(2)

    expect(ReportDao.create).toHaveBeenCalled()

  })

})

describe('Update Report', function () {

  beforeEach(function () {
    defaultTeam = new Team(null, 'Local team name')
    defaultReport = new Report(null, '', '', false, defaultTeam, defaultTeam, [])
    teamService = new TeamService()
    eventService = new EventService(jasmine.createSpy("ReportService"), jasmine.createSpy("PersonService"), jasmine.createSpy("TeamService"))
    personService = new PersonService(jasmine.createSpy("ReportService"), jasmine.createSpy("TeamService"), jasmine.createSpy("AuthService"))
    signService = new SignService()
    reportService = new ReportService(personService, teamService, eventService, signService)
  })

  it('A Report can be updated with valid parameters', function () {

    let report = defaultReport
    let team = defaultTeam

    spyOn(reportService, 'findById').andCallFake(function (anyReportId, callback) {
      callback(report, null)
    })

    spyOn(teamService, 'findById').andCallFake(function (anyTeamId, callback) {
      callback(team, null)
    })

    spyOn(ReportDao, 'update').andCallFake(function (reportId, date, location, hasFinished, localTeam, visitorTeam, incidences, oldReport, callback) {
      callback(report, null)
    })

    reportService.update(report._id, report.date, report.location, report.hasFinished, report.localTeam,
      report.visitorTeam, report.incidences, (p, err) => {
      expect(p).toEqual(report)
      expect(p).not.toBe(null)
      expect(err).toBe(null)
    })

    expect(reportService.findById).toHaveBeenCalled()
    expect(teamService.findById.calls.length).toEqual(2)
    expect(ReportDao.update).toHaveBeenCalled()

  })

  it('A Report cant be updated with non existing local team', function () {

    let report = defaultReport
    let team = defaultTeam

    let error = new InstanceNotFoundException('Non existent local team', 'report.localTeam._id', report.localTeam._id)

    spyOn(reportService, 'findById').andCallFake(function (anyReportId, callback) {
      callback(report, null)
    })

    spyOn(teamService, 'findById').andCallFake(function (anyTeamId, callback) {
      callback(null, error)
    })

    spyOn(ReportDao, 'update')

    reportService.update(report._id, report.date, report.location, report.hasFinished, report.localTeam,
      report.visitorTeam, report.incidences, (p, err) => {
        expect(err).toEqual(error)
        expect(err).not.toBe(null)
        expect(p).toBe(null)
    })

    expect(reportService.findById).toHaveBeenCalled()
    expect(teamService.findById.calls.length).toEqual(1)
    expect(ReportDao.update).not.toHaveBeenCalled()

  })


})

// TODO CHECK DELETE REPORT!!!!!!
describe('Delete Report', function () {
  beforeEach(function () {
    defaultTeam = new Team(null, 'Local team name')
    defaultReport = new Report(null, '', '', false, defaultTeam, defaultTeam, [])
    teamService = new TeamService()
    eventService = new EventService(jasmine.createSpy("ReportService"), jasmine.createSpy("PersonService"), jasmine.createSpy("TeamService"))
    personService = new PersonService(jasmine.createSpy("ReportService"), jasmine.createSpy("TeamService"), jasmine.createSpy("AuthService"))
    signService = new SignService()
    reportService = new ReportService(personService, teamService, eventService, signService)
  })

  it('A Report should be deleted if it exists', function () {
    let report = defaultReport

    spyOn(reportService, 'findById').andCallFake(function (anyReportId, callback) {
      callback(report, null)
    })

    spyOn(eventService, 'deleteAllEventsByReportId').andCallFake(function (anyReportId, callback) {
      callback(jasmine.any(Object), null)
    })

    spyOn(personService, 'deleteAllPersonByReportId').andCallFake(function (anyReportId, callback) {
      callback(jasmine.any(Object), null)
    })

    spyOn(teamService, 'delete').andCallFake(function (anyTeamId, callback) {
      callback(jasmine.any(Object), null)
    })

    spyOn(signService, 'deleteAllSignaturesByReportId').andCallFake(function (anyReportId, callback) {
      callback(jasmine.any(Object), null)
    })

    spyOn(ReportDao, 'delete').andCallFake(function (anyReport, callback) {
      callback(jasmine.any(Object), null)
    })

    reportService.delete(report._id, (res, err) => {
      expect(res).not.toBe(null)
      expect(err).toBe(null)
    })

    expect(reportService.findById).toHaveBeenCalled()
    expect(eventService.deleteAllEventsByReportId).toHaveBeenCalled()
    expect(personService.deleteAllPersonByReportId).toHaveBeenCalled()
    expect(teamService.delete.calls.length).toEqual(2)
    expect(signService.deleteAllSignaturesByReportId).toHaveBeenCalled()
    expect(ReportDao.delete).toHaveBeenCalled()

  })

  it('A Report cant be deleted if it doesnt exist', function () {
    let report = defaultReport

    let error = new InstanceNotFoundException('Non existent report', 'reportId', report._id)

    spyOn(reportService, 'findById').andCallFake(function (anyReportId, callback) {
      callback(null, error)
    })

    spyOn(eventService, 'deleteAllEventsByReportId')

    spyOn(personService, 'deleteAllPersonByReportId')

    spyOn(teamService, 'delete')

    spyOn(signService, 'deleteAllSignaturesByReportId')

    spyOn(ReportDao, 'delete')

    reportService.delete(report._id, (res, err) => {
      expect(res).toBe(null)
      expect(err).not.toBe(null)
    })

    expect(reportService.findById).toHaveBeenCalled()
    expect(eventService.deleteAllEventsByReportId).not.toHaveBeenCalled()
    expect(personService.deleteAllPersonByReportId).not.toHaveBeenCalled()
    expect(teamService.delete).not.toHaveBeenCalled()
    expect(signService.deleteAllSignaturesByReportId).not.toHaveBeenCalled()
    expect(ReportDao.delete).not.toHaveBeenCalled()

  })

  it('When a Report is deleted, all report Events from this Report must be deleted too', function () {
    let report = defaultReport

    spyOn(reportService, 'findById').andCallFake(function (anyReportId, callback) {
      callback(report, null)
    })

    spyOn(eventService, 'deleteAllEventsByReportId').andCallFake(function (anyReportId, callback) {
      callback(jasmine.any(Object), null)
    })

    spyOn(personService, 'deleteAllPersonByReportId').andCallFake(function (anyReportId, callback) {
      callback(jasmine.any(Object), null)
    })

    spyOn(teamService, 'delete').andCallFake(function (anyTeamd, callback) {
      callback(jasmine.any(Object), null)
    })

    spyOn(signService, 'deleteAllSignaturesByReportId').andCallFake(function (anyReportId, callback) {
      callback(jasmine.any(Object), null)
    })

    spyOn(ReportDao, 'delete').andCallFake(function (anyReport, callback) {
      callback(jasmine.any(Object), null)
    })

    reportService.delete(report._id, (res, err) => {
      expect(res).not.toBe(null)
      expect(err).toBe(null)
    })

    expect(reportService.findById).toHaveBeenCalled()
    expect(eventService.deleteAllEventsByReportId).toHaveBeenCalledWith(report._id, jasmine.any(Object))
    expect(personService.deleteAllPersonByReportId).toHaveBeenCalled()
    expect(teamService.delete).toHaveBeenCalled()
    expect(signService.deleteAllSignaturesByReportId).toHaveBeenCalled()
    expect(ReportDao.delete).toHaveBeenCalledWith(report, jasmine.any(Object))

  })

  it('When a Report is deleted, all report Person from this Report must be deleted too', function () {
    let report = defaultReport

    spyOn(reportService, 'findById').andCallFake(function (anyReportId, callback) {
      callback(report, null)
    })

    spyOn(eventService, 'deleteAllEventsByReportId').andCallFake(function (anyReportId, callback) {
      callback(jasmine.any(Object), null)
    })

    spyOn(personService, 'deleteAllPersonByReportId').andCallFake(function (anyReportId, callback) {
      callback(jasmine.any(Object), null)
    })

    spyOn(teamService, 'delete').andCallFake(function (anyTeamd, callback) {
      callback(jasmine.any(Object), null)
    })

    spyOn(signService, 'deleteAllSignaturesByReportId').andCallFake(function (anyReportId, callback) {
      callback(jasmine.any(Object), null)
    })

    spyOn(ReportDao, 'delete').andCallFake(function (anyReport, callback) {
      callback(jasmine.any(Object), null)
    })

    reportService.delete(report._id, (res, err) => {
      expect(res).not.toBe(null)
      expect(err).toBe(null)
    })

    expect(reportService.findById).toHaveBeenCalled()
    expect(eventService.deleteAllEventsByReportId).toHaveBeenCalled()
    expect(personService.deleteAllPersonByReportId).toHaveBeenCalled()
    expect(teamService.delete).toHaveBeenCalled()
    expect(signService.deleteAllSignaturesByReportId).toHaveBeenCalled()
    expect(ReportDao.delete).toHaveBeenCalledWith(report, jasmine.any(Object))

  })

  it('When a Report is deleted, local and visitor Teams from this Report must be deleted too', function () {
    let report = defaultReport

    spyOn(reportService, 'findById').andCallFake(function (anyReportId, callback) {
      callback(report, null)
    })

    spyOn(eventService, 'deleteAllEventsByReportId').andCallFake(function (anyReportId, callback) {
      callback(jasmine.any(Object), null)
    })

    spyOn(personService, 'deleteAllPersonByReportId').andCallFake(function (anyReportId, callback) {
      callback(jasmine.any(Object), null)
    })

    spyOn(teamService, 'delete').andCallFake(function (anyTeamId, callback) {
      callback(jasmine.any(Object), null)
    })

    spyOn(signService, 'deleteAllSignaturesByReportId').andCallFake(function (anyReportId, callback) {
      callback(jasmine.any(Object), null)
    })

    spyOn(ReportDao, 'delete').andCallFake(function (anyReport, callback) {
      callback(jasmine.any(Object), null)
    })

    reportService.delete(report._id, (res, err) => {
      expect(res).not.toBe(null)
      expect(err).toBe(null)
    })

    expect(reportService.findById).toHaveBeenCalled()
    expect(eventService.deleteAllEventsByReportId).toHaveBeenCalled()
    expect(personService.deleteAllPersonByReportId).toHaveBeenCalled()
    expect(teamService.delete.calls.length).toBe(2)
    expect(signService.deleteAllSignaturesByReportId).toHaveBeenCalled()
    expect(ReportDao.delete).toHaveBeenCalledWith(report, jasmine.any(Object))

  })

  it('When a Report is deleted, all signatures from this Report must be deleted too', function () {
    let report = defaultReport

    spyOn(reportService, 'findById').andCallFake(function (anyReportId, callback) {
      callback(report, null)
    })

    spyOn(eventService, 'deleteAllEventsByReportId').andCallFake(function (anyReportId, callback) {
      callback(jasmine.any(Object), null)
    })

    spyOn(personService, 'deleteAllPersonByReportId').andCallFake(function (anyReportId, callback) {
      callback(jasmine.any(Object), null)
    })

    spyOn(teamService, 'delete').andCallFake(function (anyTeamId, callback) {
      callback(jasmine.any(Object), null)
    })

    spyOn(signService, 'deleteAllSignaturesByReportId').andCallFake(function (anyReportId, callback) {
      callback(jasmine.any(Object), null)
    })

    spyOn(ReportDao, 'delete').andCallFake(function (anyReport, callback) {
      callback(jasmine.any(Object), null)
    })

    reportService.delete(report._id, (res, err) => {
      expect(res).not.toBe(null)
      expect(err).toBe(null)
    })

    expect(reportService.findById).toHaveBeenCalled()
    expect(eventService.deleteAllEventsByReportId).toHaveBeenCalled()
    expect(personService.deleteAllPersonByReportId).toHaveBeenCalled()
    expect(teamService.delete.calls.length).toBe(2)
    expect(signService.deleteAllSignaturesByReportId).toHaveBeenCalled()
    expect(ReportDao.delete).toHaveBeenCalledWith(report, jasmine.any(Object))

  })

})
