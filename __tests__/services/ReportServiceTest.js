jest.dontMock('../../src/app/services/ReportService')

// Services
let genericService = require('../../src/app/services/GenericService')
let reportService = require('../../src/app/services/ReportService')
let teamService = require('../../src/app/services/TeamService')
let eventService = require('../../src/app/services/EventService')
let personService = require('../../src/app/services/PersonService')
let signService = require('../../src/app/services/SignService')

let Team = require('../../src/app/models/team/Team')
let Report = require('../../src/app/models/report/Report')
let InstanceNotFoundException = require('../../src/app/models/exception/InstanceNotFoundException')

// Default elements
let defaultTeam = null
let defaultReport = null

describe('Create Report', function () {

  beforeEach(function () {
    defaultTeam = new Team(null, 'team', 'Local team name')
    defaultReport = new Report(null, 'report', '', '', false, defaultTeam, defaultTeam, [])
  })

  it('A new Report should be created and should create a new local and visitor teams', function () {

    let report = defaultReport
    let team = defaultTeam

    spyOn(teamService, 'create').andCallFake(function (anyTeamName, callback) {
      callback(team, null)
    })

    spyOn(genericService, 'create').andCallFake(function (anyReport, callback) {
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

    expect(genericService.create).toHaveBeenCalled()

  })

})

describe('Update Report', function () {

  beforeEach(function () {
    defaultTeam = new Team(null, 'team', 'Local team name')
    defaultReport = new Report(null, 'report', '', '', false, defaultTeam, defaultTeam, [])
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

    spyOn(genericService, 'update').andCallFake(function (anyReport, callback) {
      callback(report, null)
    })

    reportService.update(report._id, report.date, report.location, report.hasFinished, report.localTeam,
      report.visitorTeam, report.incidences, (p, err) => {
      expect(p).toEqual(report)
      expect(p).not.toBe(null)
      expect(err).toBe(null)
    })

    expect(teamService.findById.calls.length).toEqual(2)

    expect(genericService.update).toHaveBeenCalled()

  })

  it('A Report cant be updated with non existing local team', function () {

    let report = defaultReport
    let team = defaultTeam

    let error = new InstanceNotFoundException('Non existent local team', 'report.localTeam._id', report.localTeam._id)

    spyOn(genericService, 'findById').andCallFake(function (anyReportId, callback) {
      callback(report, null)
    })

    spyOn(teamService, 'findById').andCallFake(function (anyTeamId, callback) {
      callback(null, error)
    })

    spyOn(genericService, 'update')

    reportService.update(report._id, report.date, report.location, report.hasFinished, report.localTeam,
      report.visitorTeam, report.incidences, (p, err) => {
        expect(err).toEqual(error)
        expect(err).not.toBe(null)
        expect(p).toBe(null)
    })

    expect(teamService.findById.calls.length).toEqual(1)

    expect(genericService.update).not.toHaveBeenCalled()

  })

  it('A Report cant be updated with non existing visitor team', function () {
    expect(true).toBe(false)
  })

})

describe('Delete Report', function () {
  beforeEach(function () {
    defaultTeam = new Team(null, 'team', 'Local team name')
    defaultReport = new Report(null, 'report', '', '', false, defaultTeam, defaultTeam, [])
  })

  it('A Report should be deleted if it exists', function () {
    let report = defaultReport

    spyOn(genericService, 'findById').andCallFake(function (anyReportId, callback) {
      callback(report, null)
    })

    spyOn(eventService, 'deleteAllEventsByReportId').andCallFake(function (anyReportId, callback) {
      callback(jasmine.any(Object), null)
    })

    spyOn(personService, 'deleteAllPersonByReportId').andCallFake(function (anyReportId, callback) {
      callback(jasmine.any(Object), null)
    })

    spyOn(signService, 'deleteAllSignaturesByReportId').andCallFake(function (anyReportId, callback) {
      callback(jasmine.any(Object), null)
    })

    spyOn(genericService, 'remove').andCallFake(function (anyReport, callback) {
      callback(jasmine.any(Object), null)
    })

    reportService.delete(report._id, (res, err) => {
      expect(res).not.toBe(null)
      expect(err).toBe(null)
    })

    expect(genericService.remove).toHaveBeenCalled()

  })

  it('A Report cant be deleted if it doesnt exist', function () {
    let report = defaultReport

    let error = new InstanceNotFoundException('Non existent report', 'reportId', report._id)

    spyOn(genericService, 'findById').andCallFake(function (anyReportId, callback) {
      callback(null, error)
    })

    spyOn(eventService, 'deleteAllEventsByReportId')

    spyOn(personService, 'deleteAllPersonByReportId')

    spyOn(signService, 'deleteAllSignaturesByReportId')

    spyOn(genericService, 'remove')

    reportService.delete(report._id, (res, err) => {
      expect(res).toBe(null)
      expect(err).not.toBe(null)
    })

    expect(eventService.deleteAllEventsByReportId).not.toHaveBeenCalled()

    expect(personService.deleteAllPersonByReportId).not.toHaveBeenCalled()

    expect(signService.deleteAllSignaturesByReportId).not.toHaveBeenCalled()

    expect(genericService.remove).not.toHaveBeenCalled()

  })

  it('When a Report is deleted, all report Events from this Report must be deleted too', function () {
    let report = defaultReport

    spyOn(genericService, 'findById').andCallFake(function (anyReportId, callback) {
      callback(report, null)
    })

    spyOn(eventService, 'deleteAllEventsByReportId').andCallFake(function (anyReportId, callback) {
      callback(jasmine.any(Object), null)
    })

    spyOn(personService, 'deleteAllPersonByReportId').andCallFake(function (anyReportId, callback) {
      callback(jasmine.any(Object), null)
    })

    spyOn(signService, 'deleteAllSignaturesByReportId').andCallFake(function (anyReportId, callback) {
      callback(jasmine.any(Object), null)
    })

    spyOn(genericService, 'remove').andCallFake(function (anyReport, callback) {
      callback(jasmine.any(Object), null)
    })

    reportService.delete(report._id, (res, err) => {
      expect(res).not.toBe(null)
      expect(err).toBe(null)
    })

    // Delete all events
    expect(eventService.deleteAllEventsByReportId).toHaveBeenCalledWith(report._id, jasmine.any(Object))

    expect(genericService.remove).toHaveBeenCalledWith(report, jasmine.any(Object))

  })

  it('When a Report is deleted, all report Person from this Report must be deleted too', function () {
    let report = defaultReport

    spyOn(genericService, 'findById').andCallFake(function (anyReportId, callback) {
      callback(report, null)
    })

    spyOn(eventService, 'deleteAllEventsByReportId').andCallFake(function (anyReportId, callback) {
      callback(jasmine.any(Object), null)
    })

    spyOn(personService, 'deleteAllPersonByReportId').andCallFake(function (anyReportId, callback) {
      callback(jasmine.any(Object), null)
    })

    spyOn(signService, 'deleteAllSignaturesByReportId').andCallFake(function (anyReportId, callback) {
      callback(jasmine.any(Object), null)
    })

    spyOn(genericService, 'remove').andCallFake(function (anyReport, callback) {
      callback(jasmine.any(Object), null)
    })

    reportService.delete(report._id, (res, err) => {
      expect(res).not.toBe(null)
      expect(err).toBe(null)
    })

    // Delete all person
    expect(personService.deleteAllPersonByReportId).toHaveBeenCalledWith(report._id, jasmine.any(Object))

    expect(genericService.remove).toHaveBeenCalledWith(report, jasmine.any(Object))

  })

  it('When a Report is deleted, local and visitor Teams from this Report must be deleted too', function () {
    let report = defaultReport

    spyOn(genericService, 'findById').andCallFake(function (anyReportId, callback) {
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

    spyOn(genericService, 'remove').andCallFake(function (anyReport, callback) {
      callback(jasmine.any(Object), null)
    })

    reportService.delete(report._id, (res, err) => {
      expect(res).not.toBe(null)
      expect(err).toBe(null)
    })

    // Delete both teams
    expect(teamService.delete.calls.length).toBe(2)

    expect(genericService.remove).toHaveBeenCalledWith(report, jasmine.any(Object))

  })

  it('When a Report is deleted, all signatures from this Report must be deleted too', function () {
    let report = defaultReport

    spyOn(genericService, 'findById').andCallFake(function (anyReportId, callback) {
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

    spyOn(genericService, 'remove').andCallFake(function (anyReport, callback) {
      callback(jasmine.any(Object), null)
    })

    reportService.delete(report._id, (res, err) => {
      expect(res).not.toBe(null)
      expect(err).toBe(null)
    })

    // Delete all signs
    expect(signService.deleteAllSignaturesByReportId).toHaveBeenCalledWith(report._id, jasmine.any(Object))

    expect(genericService.remove).toHaveBeenCalledWith(report, jasmine.any(Object))

  })

})
