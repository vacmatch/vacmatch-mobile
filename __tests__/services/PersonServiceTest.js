jest.dontMock('../../src/app/services/PersonService')

// Services
let genericService = require('../../src/app/services/GenericService')
let personService = require('../../src/app/services/PersonService')
let reportService = require('../../src/app/services/ReportService')
let teamService = require('../../src/app/services/TeamService')
let authService = require('../../src/app/services/AuthService')

let Person = require('../../src/app/models/person/Person')
let User = require('../../src/app/models/user/User')
let Team = require('../../src/app/models/team/Team')
let Report = require('../../src/app/models/report/Report')
let InstanceNotFoundException = require('../../src/app/models/exception/InstanceNotFoundException')

// Default elements
let defaultPerson = null
let defaultUser = null
let defaultTeam = null
let defaultReport = null

describe('Create Person', function () {

  beforeEach(function () {
    defaultPerson = new Person(null, 'person', '', '', '', '', false, false, '', '', '')
    defaultUser = new User('user', 'username', 'pass')
    defaultTeam = new Team('team', 'Team name')
    defaultReport = new Report('report', '', '', false, defaultTeam, defaultTeam, [])
  })

  it('Create a new Person with valid parameters', function () {

    // A valid Person
    let person = defaultPerson

    // Set ReportService findById mock implementation
    spyOn(reportService, 'findById').andCallFake(function (anyReportId, callback) {
      // Returns a valid report
      callback(defaultReport, null)
    })

    // Set TeamService findById mock implementation
    spyOn(teamService, 'findById').andCallFake(function (anyTeamId, callback) {
      // Returns a valid team
      callback(defaultTeam, null)
    })

    // Set AuthService findById mock implementation
    spyOn(authService, 'findById').andCallFake(function (anyUserId, callback) {
      // Returns a valid user
      callback(defaultUser, null)
    })

    // Set GenericService.create mock implementation
    spyOn(genericService, 'create').andCallFake(function (person, callback) {
      // Returns a valid Person
      callback(person, null)
    })

    personService.create(person.name, person.cardId, person.dorsal,
      person.avatarUrl, person.isCalled, person.isStaff,
      person.reportId, person.teamId, person.userId,
      (p, err) => {
      expect(p).toEqual(person)
      expect(p).not.toBe(null)
      expect(err).toBe(null)

    })

    // Check if create was called in GenericService
    expect(genericService.create).toHaveBeenCalled()

  })

  it('A Person cant be created with non existing Report', function () {

    let nonExistingReportId = 1

    // Person with non existing Report
    let person = defaultPerson
    person.reportId = nonExistingReportId

    // An error
    let nonExistingReportException = new InstanceNotFoundException('Non existent report', 'person.reportId', person.reportId)

    // Set ReportService findById mock implementation
    spyOn(reportService, 'findById').andCallFake(function (anyReportId, callback) {
      // Returns a non existing report
      callback(null, nonExistingReportException)
    })

    // Set TeamService findById mock implementation
    spyOn(teamService, 'findById')

    // Set AuthService findById mock implementation
    spyOn(authService, 'findById')

    // Set GenericService.create mock implementation
    spyOn(genericService, 'create')

    personService.create(person.mame, person.cardId, person.dorsal,
      person.avatarUrl, person.isCalled, person.isStaff,
      person.reportId, person.teamId, person.userId,
      (person, err) => {
        expect(err).toEqual(nonExistingReportException)
        expect(person).toBe(null)
        expect(err).not.toBe(null)
    })

    // Check if create wasn't called in TeamService
    expect(teamService.findById).not.toHaveBeenCalled()
    // Check if create wasn't called in AuthService
    expect(authService.findById).not.toHaveBeenCalled()
    // Check if create wasn't called in GenericService
    expect(genericService.create).not.toHaveBeenCalled()

  })

  it('A Person cant be created with non existing Team', function () {

    let nonExistingTeamId = 1

    // Person with non existing Report
    let person = defaultPerson
    person.teamId = nonExistingTeamId

    // An error
    let nonExistingTeamException = new InstanceNotFoundException('Non existent team', 'person.teamId', person.teamId)

    // Set ReportService findById mock implementation
    spyOn(reportService, 'findById').andCallFake(function (anyReportId, callback) {
      // Returns a valid report
      callback(defaultReport, null)
    })

    // Set TeamService findById mock implementation
    spyOn(teamService, 'findById').andCallFake(function (anyTeamId, callback) {
      // Returns a non existing team
      callback(null, nonExistingTeamException)
    })

    // Set AuthService findById mock implementation
    spyOn(authService, 'findById')

    // Set GenericService.create mock implementation
    spyOn(genericService, 'create')

    personService.create(person.mame, person.cardId, person.dorsal,
      person.avatarUrl, person.isCalled, person.isStaff,
      person.reportId, person.teamId, person.userId,
      (person, err) => {
        expect(err).toEqual(nonExistingTeamException)
        expect(person).toBe(null)
        expect(err).not.toBe(null)
    })

    // Check if create wasn't called in AuthService
    expect(authService.findById).not.toHaveBeenCalled()
    // Check if create wasn't called in GenericService
    expect(genericService.create).not.toHaveBeenCalled()

  })

  it('A Person cant be created with non existing User', function () {

        let nonExistingUserId = 1

        // Person with non existing User
        let person = defaultPerson
        person.userId = nonExistingUserId

        // An error
        let nonExistingUserException = new InstanceNotFoundException('Non existent user', 'person.userId', person.userId)

        // Set ReportService findById mock implementation
        spyOn(reportService, 'findById').andCallFake(function (anyReportId, callback) {
          // Returns a valid report
          callback(defaultReport, null)
        })

        // Set TeamService findById mock implementation
        spyOn(teamService, 'findById').andCallFake(function (anyTeamId, callback) {
          // Returns a valid team
          callback(defaultTeam, null)
        })

        // Set AuthService findById mock implementation
        spyOn(authService, 'findById').andCallFake(function (anyUserId, callback) {
          callback(null, nonExistingUserException)
        })

        // Set GenericService.create mock implementation
        spyOn(genericService, 'create')

        personService.create(person.mame, person.cardId, person.dorsal,
          person.avatarUrl, person.isCalled, person.isStaff,
          person.reportId, person.teamId, person.userId,
          (person, err) => {
            expect(err).toEqual(nonExistingUserException)
            expect(person).toBe(null)
            expect(err).not.toBe(null)
        })

        // Check if create wasn't called in GenericService
        expect(genericService.create).not.toHaveBeenCalled()

  })

  it('A Person can be created with a null userId as a temporal Person', function () {

    let nullUserId = null

    // Person with null userId
    let person = defaultPerson
    person.userId = nullUserId

    // Set ReportService findById mock implementation
    spyOn(reportService, 'findById').andCallFake(function (anyReportId, callback) {
      // Returns a valid report
      callback(defaultReport, null)
    })

    // Set TeamService findById mock implementation
    spyOn(teamService, 'findById').andCallFake(function (anyTeamId, callback) {
      // Returns a valid team
      callback(defaultTeam, null)
    })

    // Set AuthService findById mock implementation
    spyOn(authService, 'findById')

    // Set GenericService.create mock implementation
    spyOn(genericService, 'create').andCallFake(function (anyUserId, callback) {
      // Returns a valid person
      callback(person, null)
    })

    personService.create(person.mame, person.cardId, person.dorsal,
      person.avatarUrl, person.isCalled, person.isStaff,
      person.reportId, person.teamId, person.userId,
      (p, err) => {
        expect(p).toEqual(person)
        expect(p).not.toBe(null)
        expect(err).toBe(null)
    })

    // Check if findById wasn't called in AuthService
    expect(authService.findById).not.toHaveBeenCalled()

    // Check if create was called in GenericService
    expect(genericService.create).toHaveBeenCalled()

  })

})


describe('Update Person', function () {

  beforeEach(function () {
    defaultPerson = new Person(null, 'person', '', '', '', '', false, false, '', '', '')
    defaultNewPerson = new Person(null, 'person', 'New person name', '', '', '', false, false, '', '', '')
  })

  it('Update a Person with valid parameters', function () {

    // A valid Person
    let person = defaultPerson

    // A valid new Person
    let newPerson = defaultNewPerson

    // Set PersonService findById mock implementation
    spyOn(personService, 'findByPersonIdReportIdAndTeamId').andCallFake(function (anyPersonId, anyReportId, anyTeamId, callback) {
      // Returns a valid Person
      callback(person, null)
    })

    // Set GenericService.create mock implementation
    spyOn(genericService, 'update').andCallFake(function (person, callback) {
      // Returns a valid Person
      callback(newPerson, null)
    })

    personService.update(newPerson._id, newPerson.name, newPerson.cardId, newPerson.dorsal,
      newPerson.avatarUrl, newPerson.isCalled, newPerson.isStaff,
      newPerson.reportId, newPerson.teamId, newPerson.teamId, newPerson.userId,
      (p, err) => {
      expect(p).toEqual(newPerson)
      expect(p).not.toBe(null)
      expect(err).toBe(null)

    })

    // Check if findByPersonIdReportIdAndTeamId was called in PersonService
    expect(personService.findByPersonIdReportIdAndTeamId).toHaveBeenCalledWith(person._id, person.reportId, person.teamId, jasmine.any(Object))

    // Check if update was called in GenericService
    expect(genericService.update).toHaveBeenCalledWith(newPerson, jasmine.any(Object))

  })

  it('A Person cant be created if it doesnt exist', function () {

    // A non existing Person
    let newPerson = defaultPerson

    // An error
    let nonExistingUserException = new InstanceNotFoundException('Non existent person', 'personId', newPerson._id)

    // Set PersonService findById mock implementation
    spyOn(personService, 'findByPersonIdReportIdAndTeamId').andCallFake(function (anyPersonId, anyReportId, anyTeamId, callback) {
      // Returns an error
      callback(null, nonExistingUserException)
    })

    // Set GenericService.create mock implementation
    spyOn(genericService, 'update')

    personService.update(newPerson._id, newPerson.name, newPerson.cardId, newPerson.dorsal,
      newPerson.avatarUrl, newPerson.isCalled, newPerson.isStaff,
      newPerson.reportId, newPerson.teamId, newPerson.teamId, newPerson.userId,
      (p, err) => {
        expect(p).toBe(null)
        expect(err).toEqual(nonExistingUserException)
        expect(err).not.toBe(null)
    })

    // Check if findByPersonIdReportIdAndTeamId was called in PersonService
    expect(personService.findByPersonIdReportIdAndTeamId).toHaveBeenCalledWith(newPerson._id,
      newPerson.reportId, newPerson.teamId, jasmine.any(Object))

    // Check if update was called in GenericService
    expect(genericService.update).not.toHaveBeenCalled()

  })

})


let defaultNewPerson = null

describe('Set called value in Person', function () {

  beforeEach(function () {
    defaultPerson = new Person(null, 'person', '', '', '', '', false, false, '', '', '')
    defaultNewPerson = new Person(null, 'person', '', '', '', '', false, false, '', '', '')
    defaultUser = new User('user', 'username', 'pass')
    defaultTeam = new Team('team', 'Team name')
    defaultReport = new Report('report', '', '', false, defaultTeam, defaultTeam, [])
  })

  it('Called value must be changed if Person exists', function () {

    // A new called value
    let newCalledValue = true

    // A valid Person
    let person = defaultPerson

    // A Person with new called value
    let newPerson = defaultNewPerson
    newPerson.isCalled = newCalledValue

    // Set PersonService findByPersonIdReportIdAndTeamId mock implementation
    spyOn(personService, 'findByPersonIdReportIdAndTeamId').andCallFake(function (anyPersonId, anyReportId, anyTeamId, callback) {
      // Returns a valid person
      callback(person, null)
    })

    // Set GenericService.update mock implementation
    spyOn(genericService, 'update').andCallFake(function (newPerson, callback) {
      // Returns a valid Person
      callback(newPerson, null)
    })

    personService.setCalledValue(person._id, person.reportId, person.teamId, newCalledValue, (p, err) => {
      expect(p).toEqual(newPerson)
      expect(p).not.toBe(null)
      expect(err).toBe(null)
    })

    // Check if update was called in GenericService
    expect(genericService.update).toHaveBeenCalledWith(newPerson, jasmine.any(Object))

  })

  it('Called value cant be changed if Person doesnt exist', function () {

    // A new called value
    let newCalledValue = true

    // A valid Person
    let person = defaultPerson

    // An error
    let nonExistingPersonException = new InstanceNotFoundException('Non existent person', 'personId', person._id)

    // Set PersonService findByPersonIdReportIdAndTeamId mock implementation
    spyOn(personService, 'findByPersonIdReportIdAndTeamId').andCallFake(function (anyPersonId, anyReportId, anyTeamId, callback) {
      // Returns an error
      callback(null, nonExistingPersonException)
    })

    // Set GenericService.update mock implementation
    spyOn(genericService, 'update')

    personService.setCalledValue(person._id, person.reportId, person.teamId, newCalledValue, (p, err) => {
      expect(p).toBe(null)
      expect(err).not.toBe(null)
      expect(err).toEqual(nonExistingPersonException)
    })

    // Check if update was called in GenericService
    expect(genericService.update).not.toHaveBeenCalled()

  })

})

describe('Set dorsal value in Person', function () {

  beforeEach(function () {
    defaultPerson = new Person(null, 'person', '', '', '', '', false, false, '', '', '')
    defaultNewPerson = new Person(null, 'person', '', '', '', '', false, false, '', '', '')
    defaultUser = new User('user', 'username', 'pass')
    defaultTeam = new Team('team', 'Team name')
    defaultReport = new Report('report', '', '', false, defaultTeam, defaultTeam, [])
  })

  it('Dorsal value must be changed if Person exists', function () {
    // A new dorsal value
    let newDorsalValue = '1'

    // A valid Person
    let person = defaultPerson

    // A valid modified Person
    let newPerson = defaultNewPerson
    newPerson.dorsal = newDorsalValue

    // Set PersonService findByPersonIdReportIdAndTeamId mock implementation
    spyOn(personService, 'findByPersonIdReportIdAndTeamId').andCallFake(function (anyPersonId, anyReportId, anyTeamId, callback) {
      // Returns an valid person
      callback(person, null)
    })

    // Set GenericService.update mock implementation
    spyOn(genericService, 'update').andCallFake(function (person, callback) {
      // Returns valid person
      callback(newPerson, null)
    })

    personService.setCalledValue(person._id, person.reportId, person.teamId, newDorsalValue, (p, err) => {
      expect(p).toEqual(newPerson)
      expect(p).not.toBe(null)
      expect(err).toBe(null)
    })

    // Check if update was called in GenericService
    expect(genericService.update).toHaveBeenCalledWith(person, jasmine.any(Object))

  })

  it('Dorsal value cant be changed if Person doesnt exist', function () {
    // A new dorsal value
    let newDorsalValue = '1'

    // A valid Person
    let person = defaultPerson

    // An error
    let nonExistingPersonException = new InstanceNotFoundException('Non existent person', 'personId', person._id)

    // Set PersonService findByPersonIdReportIdAndTeamId mock implementation
    spyOn(personService, 'findByPersonIdReportIdAndTeamId').andCallFake(function (anyPersonId, anyReportId, anyTeamId, callback) {
      // Returns an valid person
      callback(null, nonExistingPersonException)
    })

    // Set GenericService.update mock implementation
    spyOn(genericService, 'update')

    personService.setCalledValue(person._id, person.reportId, person.teamId, newDorsalValue, (p, err) => {
      expect(err).toEqual(nonExistingPersonException)
      expect(err).not.toBe(null)
      expect(p).toBe(null)
    })

    // Check if update was called in GenericService
    expect(genericService.update).not.toHaveBeenCalled()

  })

})

describe('Delete Person', function () {

  beforeEach(function () {
    defaultPerson = new Person(null, 'person', '', '', '', '', false, false, '', '', '')
    defaultUser = new User('user', 'username', 'pass')
    defaultTeam = new Team('team', 'Team name')
    defaultReport = new Report('report', '', '', false, defaultTeam, defaultTeam, [])
  })

  it('A Person must be deleted if it exists', function () {

    // A valid Person
    let person = defaultPerson

    // Set PersonService findByPersonIdReportIdAndTeamId mock implementation
    spyOn(personService, 'findByPersonIdReportIdAndTeamId').andCallFake(function (anyPersonId, anyReportId, anyTeamId, callback) {
      // Returns an valid person
      callback(person, null)
    })

    // Set GenericService.update mock implementation
    spyOn(genericService, 'remove').andCallFake(function (anyPerson, callback) {
      // Returns an object to confirm deletion
      callback(jasmine.any(Object), null)
    })

    personService.deletePerson(person._id, person.reportId, person.teamId, (p, err) => {
      expect(p).toEqual(person)
      expect(p).not.toBe(null)
      expect(err).toBe(null)
    })

    // Check if remove was called in GenericService
    expect(genericService.remove).toHaveBeenCalled()

  })

  it('A Person cant be deleted if it doesnt exist', function () {

    // A valid Person
    let person = defaultPerson

    // An error
    let nonExistingPersonException = new InstanceNotFoundException('Non existent person', 'personId', person._id)
    // Set PersonService findByPersonIdReportIdAndTeamId mock implementation
    spyOn(personService, 'findByPersonIdReportIdAndTeamId').andCallFake(function (anyPersonId, anyReportId, anyTeamId, callback) {
      // Returns an erro
      callback(null, nonExistingPersonException)
    })

    // Set GenericService.update mock implementation
    spyOn(genericService, 'remove')

    personService.deletePerson(person._id, person.reportId, person.teamId, (p, err) => {
      expect(err).toEqual(nonExistingPersonException)
      expect(err).not.toBe(null)
      expect(p).toBe(null)
    })

    // Check if remove was called in GenericService
    expect(genericService.remove).not.toHaveBeenCalled()

  })

})
