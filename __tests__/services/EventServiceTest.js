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

jest.dontMock('../../src/app/services/EventService')
jest.dontMock('../../src/app/services/ReportService')
jest.dontMock('../../src/app/services/PersonService')
jest.dontMock('../../src/app/services/TeamService')
jest.dontMock('../../src/app/models/report/status/StartedStatus')

// Services
let EventService = require('../../src/app/services/EventService')
let ReportService = require('../../src/app/services/ReportService')
let PersonService = require('../../src/app/services/PersonService')
let TeamService = require('../../src/app/services/TeamService')

let EventElements = require('../../src/app/models/event/Event')
let Person = require('../../src/app/models/person/Person')
let Team = require('../../src/app/models/team/Team')
let Report = require('../../src/app/models/report/Report')
let StartMatchEvent = require('../../src/app/models/web/event/control/StartMatchEvent')
let EndMatchEvent = require('../../src/app/models/web/event/control/EndMatchEvent')

let InstanceNotFoundException = require('../../src/app/models/exception/InstanceNotFoundException')
let ReportStatusException = require('../../src/app/models/exception/ReportStatusException')
let ReportStatus = require('../../src/app/models/report/ReportStatus')
let StartedStatus = require('../../src/app/models/report/status/StartedStatus')

let EventDao = require('../../src/app/daos/EventDao')

// Default elements
let defaultPerson = null
let defaultTeam = null
let defaultReport = null
let defaultEvent = null
let defaultControlEvent = null
let eventService = null
let teamService = null
let personService = null
let reportService = null
let startedStatus = new StartedStatus()

describe('create Sport Event', function () {

  beforeEach(function () {
    defaultPerson = new Person(null, '', '', '', '', false, false, '', '', '')
    defaultTeam = new Team(null, 'Team name')
    defaultReport = new Report(null, '', '', ReportStatus.READY, defaultTeam, defaultTeam, [])
    defaultEvent = new EventElements.Event('event', '1', defaultPerson, defaultTeam, 'goal', 1, 'cause', 1)
    reportService = new ReportService(jasmine.createSpy('PersonService'), jasmine.createSpy('TeamService'), jasmine.createSpy('EventService'), jasmine.createSpy('SignService'))
    personService = new PersonService(jasmine.createSpy('ReportService'), jasmine.createSpy('TeamService'), jasmine.createSpy('AuthService'))
    teamService = new TeamService()
    eventService = new EventService(reportService, personService, teamService)
  })

  it('Create a new Sport Event with valid parameters', function () {
    let userId = 1

    spyOn(reportService, 'findById').andCallFake(function (anyUserId, anyReportId, callback) {
      // Returns a valid report
      callback(defaultReport, null)
    })

    spyOn(personService, 'findByPersonIdReportIdAndTeamId').andCallFake(function (anyPersonId, anyReportId, anyTeamId, callback) {
      // Returns a valid person
      callback(defaultPerson, null)
    })

    spyOn(teamService, 'findById').andCallFake(function (anyTeamId, callback) {
      // Returns a valid team
      callback(defaultTeam, null)
    })

    spyOn(EventDao, 'create').andCallFake(function (reportId, person, team, eventType, matchTime, cause, timestamp, callback) {
      // Returns a valid Event
      callback(defaultEvent, null)
    })

    eventService.create(userId, defaultEvent.reportId, defaultEvent.person, defaultEvent.team,
      defaultEvent.type, defaultEvent.matchTime, defaultEvent.text, defaultEvent.timestamp,
      (event, err) => {
        expect(event).toEqual(defaultEvent)
        expect(event).not.toBe(null)
        expect(err).toBe(null)
    })

    expect(reportService.findById).toHaveBeenCalled()
    expect(personService.findByPersonIdReportIdAndTeamId).toHaveBeenCalled()
    expect(teamService.findById).toHaveBeenCalled()
    expect(EventDao.create).toHaveBeenCalled()
  })

  it('Create a new Sport Event with non existent report', function () {

    let nonExistentReportId = -1
    let userId = 1

    // Event with non existent report id
    let nonValidEvent = defaultEvent
    nonValidEvent.reportId = nonExistentReportId

    // Error: Can't find a report
    let nonExistentError = new InstanceNotFoundException('Non existent report', 'event.reportId', nonExistentReportId)

    // Set ReportService findById mock implementation
    spyOn(reportService, 'findById').andCallFake(function (anyUserId, defaultEvent, callback) {
      // Returns an error
      callback(null, nonExistentError)
    })

    spyOn(personService, 'findByPersonIdReportIdAndTeamId')
    spyOn(teamService, 'findById')
    spyOn(EventDao, 'create')

    eventService.create(userId, nonValidEvent.reportId, nonValidEvent.person, nonValidEvent.team,
      nonValidEvent.type, nonValidEvent.matchTime, nonValidEvent.text, nonValidEvent.timestamp,
      (event, err) => {
      expect(err).toEqual(nonExistentError)
      expect(err).not.toBe(null)
      expect(event).toBe(null)

    })

    expect(reportService.findById).toHaveBeenCalled()
    expect(personService.findByPersonIdReportIdAndTeamId).not.toHaveBeenCalled()
    expect(teamService.findById).not.toHaveBeenCalled()
    expect(EventDao.create).not.toHaveBeenCalled()

  })

  it('Create a new Sport Event with non existent person', function () {

    let nonExistentPersonId = -1
    let userId = 1

    // Event with non existent person id
    let nonValidEvent = defaultEvent
    nonValidEvent.person._id = nonExistentPersonId

    // Error: Can't find a person
    let nonExistentError = new InstanceNotFoundException('Non existent person', 'person._id', nonExistentPersonId)

    // Set ReportService findById to return a valid report
    spyOn(reportService, 'findById').andCallFake(function (anyUserId, anyReportId, callback) {
      // Returns a valid report
      callback(defaultReport, null)
    })

    // Set PersonService findByPersonIdReportIdAndTeamId mock implementation
    spyOn(personService, 'findByPersonIdReportIdAndTeamId').andCallFake(function (anyPersonId, anyReportId, anyTeamId, callback) {
      // Returns an error
      callback(null, nonExistentError)
    })

    spyOn(teamService, 'findById')

    spyOn(EventDao, 'create')

    eventService.create(userId, nonValidEvent.reportId, nonValidEvent.person, nonValidEvent.team,
      nonValidEvent.type, nonValidEvent.matchTime, nonValidEvent.text, nonValidEvent.timestamp,
      (event, err) => {
      expect(err).toEqual(nonExistentError)
      expect(err).not.toBe(null)
      expect(event).toBe(null)

    })

    expect(reportService.findById).toHaveBeenCalled()
    expect(personService.findByPersonIdReportIdAndTeamId).toHaveBeenCalled()
    expect(teamService.findById).not.toHaveBeenCalled()
    expect(EventDao.create).not.toHaveBeenCalled()

  })

  it('Create a new Sport Event with non existent team', function () {

        let nonExistentTeamId = -1
        let userId = 1

        // Event with non existent team id
        let nonValidEvent = defaultEvent
        nonValidEvent.team._id = nonExistentTeamId

        // Error: Can't find a team
        let nonExistentError = new InstanceNotFoundException('Non existent team', 'team._id', nonExistentTeamId)

        // Set ReportService findById to return a valid report
        spyOn(reportService, 'findById').andCallFake(function (anyUserId, anyReportId, callback) {
          // Returns a valid report
          callback(defaultReport, null)
        })

        // Set PersonService findByPersonIdReportIdAndTeamId to return a valid person
        spyOn(personService, 'findByPersonIdReportIdAndTeamId').andCallFake(function (anyPersonId, anyReportId, anyTeamId, callback) {
          // Returns a valid person
          callback(defaultPerson, null)
        })

        // Set TeamService findById to return a not find error
        spyOn(teamService, 'findById').andCallFake(function (anyTeamId, callback) {
          // Returns an error
          callback(null, nonExistentError)
        })

        spyOn(EventDao, 'create')

        eventService.create(userId, nonValidEvent.reportId, nonValidEvent.person, nonValidEvent.team,
          nonValidEvent.type, nonValidEvent.matchTime, nonValidEvent.text, nonValidEvent.timestamp,
          (event, err) => {
          expect(err).toEqual(nonExistentError)
          expect(err).not.toBe(null)
          expect(event).toBe(null)

        })

        expect(reportService.findById).toHaveBeenCalled()
        expect(personService.findByPersonIdReportIdAndTeamId).toHaveBeenCalled()
        expect(teamService.findById).toHaveBeenCalled()
        expect(EventDao.create).not.toHaveBeenCalled()

  })
})

describe('Create Control Event', function () {

  beforeEach(function () {
    defaultControlEvent = new EventElements.ControlEvent('event', '1', 'goal', 1, 'cause', 1)
  })

  it('Control Event can be created if Report exists', function () {

    // A valid Control Event
    let event = defaultControlEvent
    let userId = 1

    let validReport = defaultReport

    spyOn(reportService, 'findById').andCallFake(function (anyUserId, anyReportId, callback) {
      callback(validReport, null)
    })

    spyOn(reportService, 'update')

    spyOn(EventDao, 'createControl').andCallFake(function (reportId, eventType, matchTime,
      text, timestamp, callback) {
      callback(event, null)
    })

    // Create a new ControlEvent
    eventService.createControl(userId, event.reportId, event.type, event.matchTime, event.text,
      event.timestamp, (createdEvent, err) => {
      expect(createdEvent).toEqual(event)
      expect(createdEvent).not.toBe(null)
      expect(err).toBe(null)
    })

    expect(reportService.findById).toHaveBeenCalled()
    expect(reportService.update).not.toHaveBeenCalled()
    expect(EventDao.createControl).toHaveBeenCalled()

  })

  it("Control Event cannot be created if Report doesnt exists", function () {

    // A ControlEvent with non existent report
    let event = defaultControlEvent
    let userId = 1

    // An error to show not found report
    let notFoundError = new InstanceNotFoundException('Non existent report', 'event.reportId', event.reportId)

    // Mock ReportService findById method to return non existent report error
    spyOn(reportService, 'findById').andCallFake(function (anyUserId, anyReportId, callback) {
      callback(null, notFoundError)
    })

    spyOn(reportService, 'update')
    spyOn(EventDao, 'createControl')

    // Create a new ControlEvent
    eventService.createControl(userId, event.reportId, event.type, event.matchTime, event.text,
      event.timestamp, (createdEvent, err) => {
      expect(createdEvent).toBe(null)
      expect(err).not.toBe(null)
      expect(err).toEqual(notFoundError)
    })

    expect(reportService.findById).toHaveBeenCalled()
    expect(reportService.update).not.toHaveBeenCalled()
    expect(EventDao.createControl).not.toHaveBeenCalled()

  })

  it("When creating a Control Event that should modify Report status, if Report status cannot be modified, new Control Event shouldn't be created", function () {

    // A valid EndMatchEvent
    let event = new EndMatchEvent()
    let userId = 1

    // A valid Report
    let validReport = defaultReport
    validReport.status = ReportStatus.STARTED

    // Mock ReportService findById method to return a valid report
    spyOn(reportService, 'findById').andCallFake(function (anyUserId, anyReportId, callback) {
      callback(validReport, null)
    })

    // Mock ReportService update to send an ERROR
    spyOn(reportService, 'update').andCallFake(function (anyUserId, anyReportId, reportDate,
      reportLocation, reportStatus, reportLocal, reportVisitor, reportIncidences, callback) {
      callback(null, jasmine.any(Object))
    })

    spyOn(EventDao, 'createControl')

    // Create a new ControlEvent
    eventService.createControl(userId, event.reportId, event.type, event.matchTime, event.text,
      event.timestamp, (createdEvent, err) => {
      expect(createdEvent).toBe(null)
      expect(err).not.toBe(null)
    })

    expect(reportService.findById).toHaveBeenCalled()
    expect(reportService.update).toHaveBeenCalled()
    expect(EventDao.createControl).not.toHaveBeenCalled()

  })

  it('A match can be STARTED if actual status is READY', function () {
      let event = new StartMatchEvent()
      let userId = 1

      let validReport = defaultReport
      validReport.status = ReportStatus.READY

      spyOn(reportService, 'findById').andCallFake(function (anyUserId, anyReportId, callback) {
        callback(validReport, null)
      })

      spyOn(reportService, 'update').andCallFake(function (anyUserId, anyReportId, reportDate,
        reportLocation, reportStatus, reportLocal, reportVisitor, reportIncidences, callback) {
        callback(validReport, null)
      })

      spyOn(EventDao, 'createControl').andCallFake(function (reportId, eventType, matchTime,
        text, timestamp, callback) {
        callback(event, null)
      })

      // Create a new ControlEvent
      eventService.createControl(userId, event.reportId, event.type, event.matchTime, event.text,
        event.timestamp, (createdEvent, err) => {
        expect(createdEvent).toEqual(event)
        expect(createdEvent).not.toBe(null)
        expect(err).toBe(null)
      })

      expect(reportService.findById).toHaveBeenCalled()
      expect(reportService.update).toHaveBeenCalled()
      // Check the new status to be set
      expect(reportService.update.calls[0].args[4]).toEqual(ReportStatus.STARTED)
      expect(EventDao.createControl).toHaveBeenCalled()
  })

  it("A match cannot be FINISHED if actual status is READY", function () {
    let event = new EndMatchEvent()
    let userId = 1

    let validReport = defaultReport
    validReport.status = ReportStatus.READY

    let statusError = new ReportStatusException("You can't add a finish match event, match must be started first", 'ReportStatus', ReportStatus.STARTED)

    spyOn(reportService, 'findById').andCallFake(function (anyUserId, anyReportId, callback) {
      callback(validReport, null)
    })

    spyOn(reportService, 'update')

    spyOn(EventDao, 'createControl')

    // Create a new ControlEvent
    eventService.createControl(userId, event.reportId, event.type, event.matchTime, event.text,
      event.timestamp, (createdEvent, err) => {
      // It should return event type
      expect(createdEvent).toBe(event.type)
      expect(err).not.toBe(null)
      expect(err).toEqual(statusError)
    })

    expect(reportService.findById).toHaveBeenCalled()
    expect(reportService.update).not.toHaveBeenCalled()
    expect(EventDao.createControl).not.toHaveBeenCalled()
  })

  it("A match cannot be STARTED again if actual status is STARTED", function () {
    let event = new StartMatchEvent()
    let userId = 1

    let validReport = defaultReport
    validReport.status = ReportStatus.STARTED

    let statusError = new ReportStatusException("You can't add another start match event", 'ReportStatus', ReportStatus.STARTED)

    spyOn(reportService, 'findById').andCallFake(function (anyUserId, anyReportId, callback) {
      callback(validReport, null)
    })

    spyOn(reportService, 'update')

    spyOn(EventDao, 'createControl')

    // Create a new ControlEvent
    eventService.createControl(userId, event.reportId, event.type, event.matchTime, event.text,
      event.timestamp, (createdEvent, err) => {
      expect(createdEvent).toBe(event.type)
      expect(err).not.toBe(null)
      expect(err).toEqual(statusError)
    })

    expect(reportService.findById).toHaveBeenCalled()
    expect(reportService.update).not.toHaveBeenCalled()
    expect(EventDao.createControl).not.toHaveBeenCalled()
  })

  it("A match can be FINISHED if actual status is STARTED", function () {
    let event = new EndMatchEvent()
    let userId = 1

    let validReport = defaultReport
    validReport.status = ReportStatus.STARTED

    // Mock ReportService findById method to return a valid report
    spyOn(reportService, 'findById').andCallFake(function (anyUserId, anyReportId, callback) {
      callback(validReport, null)
    })

    spyOn(reportService, 'update').andCallFake(function (anyUserId, anyReportId, reportDate,
      reportLocation, reportStatus, reportLocal, reportVisitor, reportIncidences, callback) {
      callback(validReport, null)
    })

    spyOn(EventDao, 'createControl').andCallFake(function (reportId, eventType, matchTime,
      text, timestamp, callback) {
      callback(event, null)
    })

    // Create a new ControlEvent
    eventService.createControl(userId, event.reportId, event.type, event.matchTime, event.text,
      event.timestamp, (createdEvent, err) => {
      expect(createdEvent).toEqual(event)
      expect(createdEvent).not.toBe(null)
      expect(err).toBe(null)
    })

    expect(reportService.findById).toHaveBeenCalled()
    expect(reportService.update).toHaveBeenCalled()
    // Check the new status to be set
    expect(reportService.update.calls[0].args[4]).toEqual(ReportStatus.FINISHED)
    expect(EventDao.createControl).toHaveBeenCalled()
  })

  it("A match cannot be STARTED if actual status is FINISHED", function () {
    let event = new StartMatchEvent()
    let userId = 1

    let validReport = defaultReport
    validReport.status = ReportStatus.FINISHED

    let statusError = new ReportStatusException("You can't add a start match event because match is finished", 'ReportStatus', ReportStatus.FINISHED)

    // Mock ReportService findById method to return a valid report
    spyOn(reportService, 'findById').andCallFake(function (anyUserId, anyReportId, callback) {
      callback(validReport, null)
    })

    spyOn(reportService, 'update')

    spyOn(EventDao, 'createControl')

    // Create a new ControlEvent
    eventService.createControl(userId, event.reportId, event.type, event.matchTime, event.text,
      event.timestamp, (createdEvent, err) => {
      expect(createdEvent).toEqual(event.type)
      expect(err).not.toBe(null)
      expect(err).toEqual(statusError)
    })

    expect(reportService.findById).toHaveBeenCalled()
    expect(reportService.update).not.toHaveBeenCalled()
    expect(EventDao.createControl).not.toHaveBeenCalled()
  })

  it("A match cannot be FINISHED if actual status is FINISHED", function () {
    let event = new EndMatchEvent()
    let userId = 1

    let validReport = defaultReport
    validReport.status = ReportStatus.FINISHED

    let statusError = new ReportStatusException("You can't add an end match event because match is already finished", 'ReportStatus', ReportStatus.FINISHED)

    // Mock ReportService findById method to return a valid report
    spyOn(reportService, 'findById').andCallFake(function (anyUserId, anyReportId, callback) {
      callback(validReport, null)
    })

    spyOn(reportService, 'update')

    spyOn(EventDao, 'createControl')

    // Create a new ControlEvent
    eventService.createControl(userId, event.reportId, event.type, event.matchTime, event.text,
      event.timestamp, (createdEvent, err) => {
      expect(createdEvent).toEqual(event.type)
      expect(err).not.toBe(null)
      expect(err).toEqual(statusError)
    })

    expect(reportService.findById).toHaveBeenCalled()
    expect(reportService.update).not.toHaveBeenCalled()
    expect(EventDao.createControl).not.toHaveBeenCalled()
  })
})

describe('Delete Event', function () {

  it('Event can be deleted if this event exists', function () {

    // An existent event
    let event = defaultEvent
    let userId = 1

    let validReport = defaultReport

    spyOn(EventDao, 'findById').andCallFake(function (anyEventId, callback) {
      callback(event, null)
    })

    spyOn(reportService, 'findById').andCallFake(function (anyUserId, anyReportId, callback) {
      callback(validReport, null)
    })

    spyOn(reportService, 'update')

    spyOn(EventDao, 'deleteEvent').andCallFake(function (anyEvent, callback) {
      callback(event, null)
    })

    // Delete this event
    eventService.deleteEvent(userId, event._id, (result, err) => {
      expect(result).not.toBe(null)
      expect(err).toBe(null)
    })

    expect(EventDao.findById).toHaveBeenCalled()
    expect(reportService.findById).toHaveBeenCalled()
    expect(reportService.update).not.toHaveBeenCalled()
    expect(EventDao.deleteEvent).toHaveBeenCalled()

  })

  it('Event cannot be deleted if this event doesnt exist', function() {

    // An non existent event
    let event = defaultEvent
    let userId = 1

    // An error to show not found event
    let notFoundError = new InstanceNotFoundException('Non existent event', 'eventId', event._id)

    spyOn(EventDao, 'findById').andCallFake(function (anyEventId, callback) {
      callback(null, notFoundError)
    })

    spyOn(reportService, 'findById')

    spyOn(reportService, 'update')

    spyOn(EventDao, 'deleteEvent')

    // Delete this event
    eventService.deleteEvent(userId, event._id, (result, err) => {
      expect(err).not.toBe(null)
      expect(err).toEqual(notFoundError)
      expect(result).toBe(null)
    })

    expect(EventDao.findById).toHaveBeenCalled()
    expect(reportService.findById).not.toHaveBeenCalled()
    expect(reportService.update).not.toHaveBeenCalled()
    expect(EventDao.deleteEvent).not.toHaveBeenCalled()

  })

  it("A StartMatchEvent can be removed if actual status is READY but status should stay READY", function () {
    let event = new EndMatchEvent()
    let userId = 1

    // A valid Report
    let validReport = defaultReport
    validReport.status = ReportStatus.READY

    spyOn(EventDao, 'findById').andCallFake(function (anyEventId, callback) {
      callback(event, null)
    })

    spyOn(reportService, 'findById').andCallFake(function (anyUserId, anyReportId, callback) {
      callback(validReport, null)
    })

    spyOn(reportService, 'update').andCallFake(function (anyUserId, reportId, date, location, status,
      localTeam, visitorTeam, incidences, callback) {
      callback(validReport, null)
    })

    spyOn(EventDao, 'deleteEvent').andCallFake(function (anyEvent, callback) {
      callback(event, null)
    })

    // Delete this event
    eventService.deleteEvent(userId, event._id, (result, err) => {
      expect(result).not.toBe(null)
      expect(err).toBe(null)
    })

    expect(EventDao.findById).toHaveBeenCalled()
    expect(reportService.findById).toHaveBeenCalled()
    expect(reportService.update).toHaveBeenCalled()
    // Check the new status to be set
    expect(reportService.update.calls[0].args[4]).toEqual(ReportStatus.READY)
    expect(EventDao.deleteEvent).toHaveBeenCalled()
  })

  it("A EndMatchEvent can be removed if actual status is READY but status should stay READY", function () {
    let event = new EndMatchEvent()
    let userId = 1

    // A valid Report
    let validReport = defaultReport
    validReport.status = ReportStatus.READY

    spyOn(EventDao, 'findById').andCallFake(function (anyEventId, callback) {
      callback(event, null)
    })

    spyOn(reportService, 'findById').andCallFake(function (anyUserId, anyReportId, callback) {
      callback(validReport, null)
    })

    spyOn(reportService, 'update').andCallFake(function (anyUserId, reportId, date, location, status,
      localTeam, visitorTeam, incidences, callback) {
      callback(validReport, null)
    })

    spyOn(EventDao, 'deleteEvent').andCallFake(function (anyEvent, callback) {
      callback(event, null)
    })

    // Delete this event
    eventService.deleteEvent(userId, event._id, (result, err) => {
      expect(result).not.toBe(null)
      expect(err).toBe(null)
    })

    expect(EventDao.findById).toHaveBeenCalled()
    expect(reportService.findById).toHaveBeenCalled()
    expect(reportService.update).toHaveBeenCalled()
    // Check the new status to be set
    expect(reportService.update.calls[0].args[4]).toEqual(ReportStatus.READY)
    expect(EventDao.deleteEvent).toHaveBeenCalled()
  })

  it("A StartMatchEvent can be removed and new report status be set to READY if actual status is STARTED", function () {
    let event = new StartMatchEvent()
    let userId = 1

    // A valid Report
    let validReport = defaultReport
    validReport.status = ReportStatus.STARTED

    spyOn(EventDao, 'findById').andCallFake(function (anyEventId, callback) {
      callback(event, null)
    })

    spyOn(reportService, 'findById').andCallFake(function (anyUserId, anyReportId, callback) {
      callback(validReport, null)
    })

    spyOn(reportService, 'update').andCallFake(function (anyUserId, reportId, date, location, status,
      localTeam, visitorTeam, incidences, callback) {
      callback(validReport, null)
    })

    spyOn(EventDao, 'deleteEvent').andCallFake(function (anyEvent, callback) {
      callback(event, null)
    })

    // Delete this event
    eventService.deleteEvent(userId, event._id, (result, err) => {
      expect(result).not.toBe(null)
      expect(err).toBe(null)
    })

    expect(EventDao.findById).toHaveBeenCalled()
    expect(reportService.findById).toHaveBeenCalled()
    expect(reportService.update).toHaveBeenCalled()
    // Check the new status to be set
    expect(reportService.update.calls[0].args[4]).toEqual(ReportStatus.READY)
    expect(EventDao.deleteEvent).toHaveBeenCalled()
  })

  it("A EndMatchEvent can be removed if actual status is STARTED but status should stay STARTED", function () {
    let event = new EndMatchEvent()
    let userId = 1

    // A valid Report
    let validReport = defaultReport
    validReport.status = ReportStatus.STARTED

    spyOn(EventDao, 'findById').andCallFake(function (anyEventId, callback) {
      callback(event, null)
    })

    spyOn(reportService, 'findById').andCallFake(function (anyUserId, anyReportId, callback) {
      callback(validReport, null)
    })

    spyOn(reportService, 'update').andCallFake(function (anyUserId, reportId, date, location, status,
      localTeam, visitorTeam, incidences, callback) {
      callback(validReport, null)
    })

    spyOn(EventDao, 'deleteEvent').andCallFake(function (anyEvent, callback) {
      callback(event, null)
    })

    // Delete this event
    eventService.deleteEvent(userId, event._id, (result, err) => {
      expect(result).not.toBe(null)
      expect(err).toBe(null)
    })

    expect(EventDao.findById).toHaveBeenCalled()
    expect(reportService.findById).toHaveBeenCalled()
    expect(reportService.update).toHaveBeenCalled()
    // Check the new status to be set
    expect(reportService.update.calls[0].args[4]).toEqual(ReportStatus.STARTED)
    expect(EventDao.deleteEvent).toHaveBeenCalled()
  })

  it("A StartMatchEvent cannot be removed if actual status is FINISHED, EndMatchEvent should be removed first", function () {
    let event = new StartMatchEvent()
    let userId = 1

    // A valid Report
    let validReport = defaultReport
    validReport.status = ReportStatus.FINISHED

    let statusError = new ReportStatusException("You can't remove a start match event because match is already finished", 'ReportStatus', ReportStatus.FINISHED)

    spyOn(EventDao, 'findById').andCallFake(function (anyEventId, callback) {
      callback(event, null)
    })

    spyOn(reportService, 'findById').andCallFake(function (anyUserId, anyReportId, callback) {
      callback(validReport, null)
    })

    spyOn(reportService, 'update')

    spyOn(EventDao, 'deleteEvent')

    // Delete this event
    eventService.deleteEvent(userId, event._id, (result, err) => {
      expect(result).toEqual(event.type)
      expect(err).not.toBe(null)
      expect(err).toEqual(statusError)
    })

    expect(EventDao.findById).toHaveBeenCalled()
    expect(reportService.findById).toHaveBeenCalled()
    expect(reportService.update).not.toHaveBeenCalled()
    expect(EventDao.deleteEvent).not.toHaveBeenCalled()
  })

  it("A EndMatchEvent can be removed if actual status is FINISHED", function () {
    let event = new EndMatchEvent()
    let userId = 1

    // A valid Report
    let validReport = defaultReport
    validReport.status = ReportStatus.FINISHED

    spyOn(EventDao, 'findById').andCallFake(function (anyEventId, callback) {
      callback(event, null)
    })

    spyOn(reportService, 'findById').andCallFake(function (anyUserId, anyReportId, callback) {
      callback(validReport, null)
    })

    spyOn(reportService, 'update').andCallFake(function (anyUserId, reportId, date, location, status,
      localTeam, visitorTeam, incidences, callback) {
      callback(validReport, null)
    })

    spyOn(EventDao, 'deleteEvent').andCallFake(function (anyEvent, callback) {
      callback(event, null)
    })

    // Delete this event
    eventService.deleteEvent(userId, event._id, (result, err) => {
      expect(result).not.toBe(null)
      expect(err).toBe(null)
    })

    expect(EventDao.findById).toHaveBeenCalled()
    expect(reportService.findById).toHaveBeenCalled()
    expect(reportService.update).toHaveBeenCalled()
    // Check the new status to be set
    expect(reportService.update.calls[0].args[4]).toEqual(ReportStatus.STARTED)
    expect(EventDao.deleteEvent).toHaveBeenCalled()
  })

})
