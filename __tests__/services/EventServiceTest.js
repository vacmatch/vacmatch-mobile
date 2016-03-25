jest.dontMock('../../src/app/services/EventService')

// Services
let eventService = require('../../src/app/services/EventService')
let reportService = require('../../src/app/services/ReportService')
let personService = require('../../src/app/services/PersonService')
let teamService = require('../../src/app/services/TeamService')

let EventElements = require('../../src/app/models/event/Event')
let Person = require('../../src/app/models/person/Person')
let Team = require('../../src/app/models/team/Team')
let Report = require('../../src/app/models/report/Report')
let InstanceNotFoundException = require('../../src/app/models/exception/InstanceNotFoundException')

let EventDao = require('../../src/app/daos/EventDao')

// Default elements
let defaultPerson = null
let defaultTeam = null
let defaultReport = null
let defaultEvent = null
let defaultControlEvent = null

describe('create Sport Event', function () {

  beforeEach(function () {
    defaultPerson = new Person(null, '', '', '', '', false, false, '', '', '')
    defaultTeam = new Team(null, 'Team name')
    defaultReport = new Report(null, '', '', false, defaultTeam, defaultTeam, [])
    defaultEvent = new EventElements.Event('event', '1', defaultPerson, defaultTeam, 'goal', 1, 'cause', 1)
  })

  it('Create a new Sport Event with valid parameters', function () {

    let existentReportId = 1

    // Set ReportService findById mock implementation
    spyOn(reportService, 'findById').andCallFake(function (existentReportId, callback) {
      // Returns a valid report
      callback(defaultReport, null)
    })

    // Set PersonService findByPersonIdReportIdAndTeamId mock implementation
    spyOn(personService, 'findByPersonIdReportIdAndTeamId').andCallFake(function (anyPersonId, anyReportId, anyTeamId, callback) {
      // Returns a valid person
      callback(defaultPerson, null)
    })

    // Set TeamService findById mock implementation
    spyOn(teamService, 'findById').andCallFake(function (anyTeamId, callback) {
      // Returns a valid team
      callback(defaultTeam, null)
    })

    spyOn(EventDao, 'create').andCallFake(function (reportId, person, team, eventType, matchTime, cause, timestamp, callback) {
      // Returns a valid Event
      callback(defaultEvent, null)
    })

    eventService.create(defaultEvent.reportId, defaultEvent.person, defaultEvent.team,
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

    // Event with non existent report id
    let nonValidEvent = defaultEvent
    nonValidEvent.reportId = nonExistentReportId

    // Error: Can't find a report
    let nonExistentError = new InstanceNotFoundException('Non existent report', 'event.reportId', nonExistentReportId)

    // Set ReportService findById mock implementation
    spyOn(reportService, 'findById').andCallFake(function (defaultEvent, callback) {
      // Returns an error
      callback(null, nonExistentError)
    })

    spyOn(personService, 'findByPersonIdReportIdAndTeamId')
    spyOn(teamService, 'findById')
    spyOn(EventDao, 'create')

    eventService.create(nonValidEvent.reportId, nonValidEvent.person, nonValidEvent.team,
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

    // Event with non existent person id
    let nonValidEvent = defaultEvent
    nonValidEvent.person._id = nonExistentPersonId

    // Error: Can't find a person
    let nonExistentError = new InstanceNotFoundException('Non existent person', 'person._id', nonExistentPersonId)

    // Set ReportService findById to return a valid report
    spyOn(reportService, 'findById').andCallFake(function (anyReportId, callback) {
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

    eventService.create(nonValidEvent.reportId, nonValidEvent.person, nonValidEvent.team,
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

        // Event with non existent team id
        let nonValidEvent = defaultEvent
        nonValidEvent.team._id = nonExistentTeamId

        // Error: Can't find a team
        let nonExistentError = new InstanceNotFoundException('Non existent team', 'team._id', nonExistentTeamId)

        // Set ReportService findById to return a valid report
        spyOn(reportService, 'findById').andCallFake(function (anyReportId, callback) {
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

        eventService.create(nonValidEvent.reportId, nonValidEvent.person, nonValidEvent.team,
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

  it('Control Event can be created if report exists', function () {

    // A valid Control Event
    let event = defaultControlEvent

    let validReport = defaultReport

    // Mock ReportService findById method to return a valid report
    spyOn(reportService, 'findById').andCallFake(function (anyReportId, callback) {
      callback(validReport, null)
    })

    spyOn(reportService, 'update')

    spyOn(EventDao, 'create').andCallFake(function (reportId, eventType, matchTime,
      text, timestamp, callback) {
      callback(event, null)
    })

    // Create a new ControlEvent
    eventService.createControl(event.reportId, event.type, event.matchTime, event.text,
      event.timestamp, (createdEvent, err) => {
      expect(createdEvent).toEqual(event)
      expect(createdEvent).not.toBe(null)
      expect(err).toBe(null)
    })

    expect(reportService.findById).toHaveBeenCalled()
    expect(reportService.update).not.toHaveBeenCalled()
    expect(EventDao.create).toHaveBeenCalled()

  })

  it('Control Event cannot be created if report doesnt exists', function () {

    // A ControlEvent with non existent report
    let event = defaultControlEvent

    // An error to show not found report
    let notFoundError = new InstanceNotFoundException('Non existent report', 'event.reportId', event.reportId)

    // Mock ReportService findById method to return non existent report error
    spyOn(reportService, 'findById').andCallFake(function (anyReportId, callback) {
      callback(null, notFoundError)
    })

    spyOn(reportService, 'update')
    spyOn(EventDao, 'create')

    // Create a new ControlEvent
    eventService.createControl(event.reportId, event.type, event.matchTime, event.text,
      event.timestamp, (createdEvent, err) => {
      expect(createdEvent).toBe(null)
      expect(err).not.toBe(null)
      expect(err).toEqual(notFoundError)
    })

    expect(reportService.findById).toHaveBeenCalled()
    expect(reportService.update).not.toHaveBeenCalled()
    expect(EventDao.create).not.toHaveBeenCalled()

  })

  it('Report status should be modified when creating an EndMatchEvent and report exists', function () {

      // A valid EndMatchEvent
      let event = defaultControlEvent
      event.type = 'end-match'

      // A valid Report
      let validReport = defaultReport

      // Mock ReportService findById method to return a valid report
      spyOn(reportService, 'findById').andCallFake(function (anyReportId, callback) {
        callback(validReport, null)
      })

      // Mock ReportService update to modify report status
      spyOn(reportService, 'update').andCallFake(function (anyReportId, reportDate,
        reportFinished, reportLocation, reportLocal, reportVisitor, reportIncidences, callback) {
        callback(validReport, null)
      })

      spyOn(EventDao, 'create').andCallFake(function (reportId, eventType, matchTime,
        text, timestamp, callback) {
        callback(event, null)
      })

      // Create a new ControlEvent
      eventService.createControl(event.reportId, event.type, event.matchTime, event.text,
        event.timestamp, (createdEvent, err) => {
        expect(createdEvent).toEqual(event)
        expect(createdEvent).not.toBe(null)
        expect(err).toBe(null)
      })

      expect(reportService.findById).toHaveBeenCalled()
      // Check if reportService update method was called to update Report status
      expect(reportService.update).toHaveBeenCalled()
      // Check if genericService create method was called
      expect(EventDao.create).toHaveBeenCalled()

  })

  it('If report status cant be modified when creating an EndMatchEvent, new control event shouldnt be created', function () {

    // A valid EndMatchEvent
    let event = defaultControlEvent
    event.type = 'end-match'

    // A valid Report
    let validReport = defaultReport

    // Mock ReportService findById method to return a valid report
    spyOn(reportService, 'findById').andCallFake(function (anyReportId, callback) {
      callback(event, null)
    })

    // Mock ReportService update to send an ERROR
    spyOn(reportService, 'update').andCallFake(function (anyReportId, reportDate,
      reportFinished, reportLocation, reportLocal, reportVisitor, reportIncidences, callback) {
      callback(null, jasmine.any(Object))
    })

    spyOn(EventDao, 'create')

    // Create a new ControlEvent
    eventService.createControl(event.reportId, event.type, event.matchTime, event.text,
      event.timestamp, (createdEvent, err) => {
      expect(createdEvent).toBe(null)
      expect(err).not.toBe(null)
    })

    expect(reportService.findById).toHaveBeenCalled()
    expect(reportService.update).toHaveBeenCalled()
    expect(EventDao.create).not.toHaveBeenCalled()

  })
})

describe('Delete Event', function () {

  it('Event can be deleted if this event exists', function () {

    // An existent event
    let event = defaultEvent

    let validReport = defaultReport

    spyOn(EventDao, 'findById').andCallFake(function (anyEventId, callback) {
      callback(event, null)
    })

    spyOn(reportService, 'findById')

    spyOn(reportService, 'update')

    spyOn(EventDao, 'deleteEvent').andCallFake(function (anyEvent, callback) {
      callback(event, null)
    })

    // Delete this event
    eventService.deleteEvent(event._id, (result, err) => {
      expect(result).not.toBe(null)
      expect(err).toBe(null)
    })

    expect(EventDao.findById).toHaveBeenCalled()
    expect(reportService.findById).not.toHaveBeenCalled()
    expect(reportService.update).not.toHaveBeenCalled()
    expect(EventDao.deleteEvent).toHaveBeenCalled()

  })

  it('Event cannot be deleted if this event doesnt exists', function () {

    // An non existent event
    let event = defaultEvent

    // An error to show not found event
    let notFoundError = new InstanceNotFoundException('Non existent event', 'eventId', event._id)

    spyOn(EventDao, 'findById').andCallFake(function (anyEventId, callback) {
      callback(null, notFoundError)
    })

    spyOn(reportService, 'findById')

    spyOn(reportService, 'update')

    spyOn(EventDao, 'deleteEvent')

    // Delete this event
    eventService.deleteEvent(event._id, (result, err) => {
      expect(err).not.toBe(null)
      expect(err).toEqual(notFoundError)
      expect(result).toBe(null)
    })

    expect(EventDao.findById).toHaveBeenCalled()
    expect(reportService.findById).not.toHaveBeenCalled()
    expect(reportService.update).not.toHaveBeenCalled()
    expect(EventDao.deleteEvent).not.toHaveBeenCalled()

  })

  it('Report status should be modified when removing a EndMatchEvent which exists', function () {

    // An existent EndMatchEvent
    let event = defaultEvent
    event.type = 'end-match'

    // A valid Report
    let validReport = defaultReport

    spyOn(EventDao, 'findById').andCallFake(function (anyEventId, callback) {
      callback(event, null)
    })

    spyOn(reportService, 'findById').andCallFake(function (anyReportId, callback) {
      callback(validReport, null)
    })

    spyOn(reportService, 'update').andCallFake(function (reportId, date, hasFinished, location,
      localTeam, visitorTeam, incidences, callback) {
      callback(validReport, null)
    })

    spyOn(EventDao, 'deleteEvent').andCallFake(function (anyEvent, callback) {
      callback(event, null)
    })

    // Delete this event
    eventService.deleteEvent(event._id, (result, err) => {
      expect(result).not.toBe(null)
      expect(err).toBe(null)
    })

    expect(EventDao.findById).toHaveBeenCalled()
    expect(reportService.findById).toHaveBeenCalled()
    expect(reportService.update).toHaveBeenCalled()
    expect(EventDao.deleteEvent).toHaveBeenCalled()

  })

  it('If report status cant be modified when an EndMatchEvent is being deleted, Event shouldnt be deleted', function () {

    // An existent EndMatchEvent
    let event = defaultEvent
    event.type = 'end-match'

    // A valid Report
    let validReport = defaultReport

    spyOn(EventDao, 'findById').andCallFake(function (anyEventId, callback) {
      callback(event, null)
    })

    spyOn(reportService, 'findById').andCallFake(function (anyReportId, callback) {
      callback(validReport, null)
    })

    spyOn(reportService, 'update').andCallFake(function (reportId, date, hasFinished, location,
      localTeam, visitorTeam, incidences, callback) {
      callback(null, jasmine.any(Object))
    })

    spyOn(EventDao, 'deleteEvent')

    // Delete this event
    eventService.deleteEvent(event._id, (result, err) => {
      expect(result).toBe(null)
      expect(err).not.toBe(null)
    })

    expect(EventDao.findById).toHaveBeenCalled()
    expect(reportService.findById).toHaveBeenCalled()
    expect(reportService.update).toHaveBeenCalled()
    expect(EventDao.deleteEvent).not.toHaveBeenCalled()

  })

  it('If report doesnt exists when an EndMatchEvent is being deleted, Event shouldnt be deleted', function () {

    // An existent EndMatchEvent
    let event = defaultEvent
    event.type = 'end-match'

    // A valid Report
    let validReport = defaultReport

    let notFoundError = new InstanceNotFoundException('Non existent report', 'event.reportId', event.reportId)

    spyOn(EventDao, 'findById').andCallFake(function (anyEventId, callback) {
      callback(event, null)
    })

    spyOn(reportService, 'findById').andCallFake(function (anyReportId, callback) {
      callback(null, notFoundError)
    })

    spyOn(reportService, 'update')

    spyOn(EventDao, 'deleteEvent')

    // Delete this event
    eventService.deleteEvent(event._id, (result, err) => {
      expect(result).toBe(null)
      expect(err).not.toBe(null)
      expect(err).toEqual(notFoundError)
    })

    expect(EventDao.findById).toHaveBeenCalled()
    expect(reportService.findById).toHaveBeenCalled()
    expect(reportService.update).not.toHaveBeenCalled()
    expect(EventDao.deleteEvent).not.toHaveBeenCalled()

  })
})
