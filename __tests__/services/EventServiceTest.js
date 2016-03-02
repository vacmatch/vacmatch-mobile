jest.dontMock('../../src/app/services/EventService')

// Services
let eventService = require('../../src/app/services/EventService')
let genericService = require('../../src/app/services/GenericService')
let reportService = require('../../src/app/services/ReportService')
let personService = require('../../src/app/services/PersonService')
let teamService = require('../../src/app/services/TeamService')

let EventElements = require('../../src/app/models/event/Event')
let Person = require('../../src/app/models/person/Person')
let Team = require('../../src/app/models/team/Team')
let Report = require('../../src/app/models/report/Report')
let InstanceNotFoundException = require('../../src/app/models/exception/InstanceNotFoundException')

// Default elements
let defaultPerson = null
let defaultTeam = null
let defaultReport = null
let defaultEvent = null
let defaultControlEvent = null

describe('create Sport Event', function () {

  beforeEach(function () {
    defaultPerson = new Person('person', '', '', '', '', false, false, '', '', '')
    defaultTeam = new Team('team', 'Team name')
    defaultReport = new Report('report', '', '', false, defaultTeam, defaultTeam, [])
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

    // Set GenericService.create mock implementation
    spyOn(genericService, 'create').andCallFake(function (defaultEvent, callback) {
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

    // Check if create was called in GenericService
    expect(genericService.create).toHaveBeenCalled()

  })

  it('Create a new Sport Event with non existent report', function () {

    let nonExistentReportId = -1

    // Event with non existent report id
    let nonValidEvent = defaultEvent
    nonValidEvent.reportId = nonExistentReportId

    // Error: Can't find a report
    let nonExistentError = new InstanceNotFoundException('Non existent report', 'reportId', nonExistentReportId)

    // Set ReportService findById mock implementation
    spyOn(reportService, 'findById').andCallFake(function (defaultEvent, callback) {
      // Returns an error
      callback(null, nonExistentError)
    })

    // Set spy on GenericService.create
    spyOn(genericService, 'create')


    eventService.create(nonValidEvent.reportId, nonValidEvent.person, nonValidEvent.team,
      nonValidEvent.type, nonValidEvent.matchTime, nonValidEvent.text, nonValidEvent.timestamp,
      (event, err) => {
      expect(err).toEqual(nonExistentError)
      expect(err).not.toBe(null)
      expect(event).toBe(null)

    })

    // Check if create wasn't called in GenericService
    expect(genericService.create).not.toHaveBeenCalled()

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

    // Set spy on GenericService.create
    spyOn(genericService, 'create')

    eventService.create(nonValidEvent.reportId, nonValidEvent.person, nonValidEvent.team,
      nonValidEvent.type, nonValidEvent.matchTime, nonValidEvent.text, nonValidEvent.timestamp,
      (event, err) => {
      expect(err).toEqual(nonExistentError)
      expect(err).not.toBe(null)
      expect(event).toBe(null)

    })

    // Check if create was called in GenericService
    expect(genericService.create).not.toHaveBeenCalled()

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

        // Set spy on GenericService.create
        spyOn(genericService, 'create')

        eventService.create(nonValidEvent.reportId, nonValidEvent.person, nonValidEvent.team,
          nonValidEvent.type, nonValidEvent.matchTime, nonValidEvent.text, nonValidEvent.timestamp,
          (event, err) => {
          expect(err).toEqual(nonExistentError)
          expect(err).not.toBe(null)
          expect(event).toBe(null)

        })
        // Check if create was called in GenericService
        expect(genericService.create).not.toHaveBeenCalled()
  })
})

describe('Create Control Event', function () {

  beforeEach(function () {
    defaultControlEvent = new EventElements.ControlEvent('event', '1', 'goal', 1, 'cause', 1)
  })

  it('Control Event can be created if report exists', function () {

    // A valid Control Event
    let event = defaultControlEvent

    // Mock ReportService findById method to return a valid report
    spyOn(reportService, 'findById').andCallFake(function (anyReportId, callback) {
      callback(event, null)
    })

    // Mock GenericService create to return a valid new ControlEvent
    spyOn(genericService, 'create').andCallFake(function (anyControlEvent, callback) {
      callback(event, null)
    })

    // Create a new ControlEvent
    eventService.createControl(event.reportId, event.type, event.matchTime, event.text,
      event.timestamp, (createdEvent, err) => {
      expect(createdEvent).toEqual(event)
      expect(createdEvent).not.toBe(null)
      expect(err).toBe(null)
    })

    // Check if genericService create method was called
    expect(genericService.create).toHaveBeenCalled()

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

    // Mock GenericService create without return value (Just to check if it wasn't called)
    spyOn(genericService, 'create')

    // Create a new ControlEvent
    eventService.createControl(event.reportId, event.type, event.matchTime, event.text,
      event.timestamp, (createdEvent, err) => {
      expect(createdEvent).toBe(null)
      expect(err).not.toBe(null)
      expect(err).toEqual(notFoundError)
    })

    // Check if genericService create method was called
    expect(genericService.create).not.toHaveBeenCalled()

  })

  it('Report status should be modified when creating an EndMatchEvent and report exists', function () {

      // A valid EndMatchEvent
      let event = defaultControlEvent
      event.type = 'end-match'

      // A valid Report
      let validReport = defaultReport

      // Mock ReportService findById method to return a valid report
      spyOn(reportService, 'findById').andCallFake(function (anyReportId, callback) {
        callback(event, null)
      })

      // Mock GenericService create to return a valid new ControlEvent
      spyOn(genericService, 'create').andCallFake(function (anyControlEvent, callback) {
        callback(event, null)
      })

      // Mock ReportService update to modify report status
      spyOn(reportService, 'update').andCallFake(function (anyReportId, reportDate,
        reportFinished, reportLocation, reportLocal, reportVisitor, reportIncidences, callback) {
        callback(validReport, null)
      })

      // Create a new ControlEvent
      eventService.createControl(event.reportId, event.type, event.matchTime, event.text,
        event.timestamp, (createdEvent, err) => {
        expect(createdEvent).toEqual(event)
        expect(createdEvent).not.toBe(null)
        expect(err).toBe(null)
      })

      // Check if genericService create method was called
      expect(genericService.create).toHaveBeenCalled()

      // Check if reportService update method was called to update Report status
      expect(reportService.update).toHaveBeenCalled()

  })

})

describe('Delete Event', function () {

  it('Event can be deleted if this event exists', function () {

    // An existent event
    let event = defaultEvent

    // Mock GenericService findById to return this event
    spyOn(genericService, 'findById').andCallFake(function (anyEventId, callback) {
      callback(event, null)
    })

    // Mock GenericService remove to return an OK result
    spyOn(genericService, 'remove').andCallFake(function (anyEvent, callback) {
      callback(jasmine.any(Object), null)
    })

    // Delete this event
    eventService.deleteEvent(event._id, (result, err) => {
      expect(result).not.toBe(null)
      expect(err).toBe(null)
    })

    // Check if genericService remove method was called
    expect(genericService.remove).toHaveBeenCalled()

  })

  it('Event cannot be deleted if this event doesnt exists', function () {

    // An non existent event
    let event = defaultEvent

    // An error to show not found event
    let notFoundError = new InstanceNotFoundException('Non existent event', 'eventId', event._id)

    // Mock GenericService findById to return a not found error
    spyOn(genericService, 'findById').andCallFake(function (anyEventId, callback) {
      callback(null, notFoundError)
    })

    // Mock GenericService remove (just to check if it wasn't called)
    spyOn(genericService, 'remove')

    // Delete this event
    eventService.deleteEvent(event._id, (result, err) => {
      expect(err).not.toBe(null)
      expect(err).toEqual(notFoundError)
      expect(result).toBe(null)
    })

    // Check if genericService remove method wasn't called
    expect(genericService.remove).not.toHaveBeenCalled()

  })

  it('Report status should be modified when removing a EndMatchEvent which exists', function () {

    // An existent EndMatchEvent
    let event = defaultEvent
    event.type = 'end-match'

    // A valid Report
    let validReport = defaultReport

    // Mock GenericService findById to return this event
    spyOn(genericService, 'findById').andCallFake(function (anyEventId, callback) {
      callback(event, null)
    })

    // Mock GenericService remove to return an OK result
    spyOn(genericService, 'remove').andCallFake(function (anyEvent, callback) {
      callback(jasmine.any(Object), null)
    })

    // Mock ReportService update to modify report status
    spyOn(reportService, 'update').andCallFake(function (anyReportId, reportDate,
      reportFinished, reportLocation, reportLocal, reportVisitor, reportIncidences, callback) {
      callback(validReport, null)
    })

    // Delete this event
    eventService.deleteEvent(event._id, (result, err) => {
      expect(result).not.toBe(null)
      expect(err).toBe(null)
    })

    // Check if genericService remove method was called
    expect(genericService.remove).toHaveBeenCalled()

    // Check if reportService update method was called to update Report status
    expect(reportService.update).toHaveBeenCalled()

  })

})
