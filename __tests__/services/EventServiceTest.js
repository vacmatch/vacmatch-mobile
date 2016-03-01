jest.dontMock('../../src/app/services/EventService')

describe('create Sport Event', function () {
  // Default elements
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

  let defaultPerson = null
  let defaultTeam = null
  let defaultReport = null
  let defaultEvent = null

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
