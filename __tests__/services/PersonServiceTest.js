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

jest.dontMock('../../src/app/services/PersonService')
jest.dontMock('../../src/app/services/ReportService')
jest.dontMock('../../src/app/services/TeamService')
jest.dontMock('../../src/app/services/RefereeService')
jest.dontMock('../../src/app/services/AuthService')

// Services
let PersonService = require('../../src/app/services/PersonService')
let ReportService = require('../../src/app/services/ReportService')
let TeamService = require('../../src/app/services/TeamService')
let RefereeService = require('../../src/app/services/RefereeService')
let AuthService = require('../../src/app/services/AuthService')
let EventService = require('../../src/app/services/EventService')

let Person = require('../../src/app/models/person/Person')
let User = require('../../src/app/models/user/User')
let EventElements = require('../../src/app/models/event/Event')
let Team = require('../../src/app/models/team/Team')
let Report = require('../../src/app/models/report/Report')
let InstanceNotFoundException = require('../../src/app/models/exception/InstanceNotFoundException')
let ExistingElementsException = require('../../src/app/models/exception/ExistingElementsException')

let PersonDao = require('../../src/app/daos/PersonDao')

// Default elements
let defaultPerson = null
let defaultUser = null
let defaultTeam = null
let defaultReport = null
let personService = null
let reportService = null
let teamService = null
let refereeService = null
let authService = null
let eventService = null

describe('Create Person', function () {

  beforeEach(function () {
    defaultPerson = new Person(null, '', '', '', '', false, false, '', '', '')
    defaultUser = new User(null, 'username', 'password', 'avatarUrl', 'email', 'firstName', 'lastName', 'cardId', 'signKey')
    defaultTeam = new Team(null, 'Team name')
    defaultReport = new Report(null, '', '', false, defaultTeam, defaultTeam, [])
    reportService = new ReportService(jasmine.createSpy('PersonService'), jasmine.createSpy('TeamService'), jasmine.createSpy('EventService'), jasmine.createSpy('SignService'))
    teamService = new TeamService()
    refereeService = new RefereeService()
    authService = new AuthService(jasmine.createSpy('RefereeService'))
    eventService = new EventService(jasmine.createSpy('ReportService'), jasmine.createSpy('PersonService'), jasmine.createSpy('TeamService'))
    personService = new PersonService(reportService, teamService, authService, eventService)
  })

  it('Create a new Person with valid parameters', function () {

    // A valid Person
    let person = defaultPerson
    let refereeUserId = 1

    spyOn(reportService, 'findById').andCallFake(function (anyUserId, anyReportId, callback) {
      callback(defaultReport, null)
    })

    spyOn(teamService, 'findById').andCallFake(function (anyTeamId, callback) {
      callback(defaultTeam, null)
    })

    spyOn(authService, 'findById').andCallFake(function (anyUserId, callback) {
      callback(defaultUser, null)
    })

    spyOn(PersonDao, 'create').andCallFake(function (name, cardId, dorsal, avatarUrl, isCalled, isStaff, reportId, teamId, userId, callback) {
      callback(person, null)
    })

    personService.create(refereeUserId, person.name, person.cardId, person.dorsal,
      person.avatarUrl, person.isCalled, person.isStaff,
      person.reportId, person.teamId, person.userId,
      (p, err) => {
      expect(p).toEqual(person)
      expect(p).not.toBe(null)
      expect(err).toBe(null)

    })

    expect(reportService.findById).toHaveBeenCalled()
    expect(teamService.findById).toHaveBeenCalled()
    expect(authService.findById).toHaveBeenCalled()
    expect(PersonDao.create).toHaveBeenCalled()

  })

  it('A Person cant be created with non existing Report', function () {

    let nonExistingReportId = 1
    let refereeUserId = 1

    // Person with non existing Report
    let person = defaultPerson
    person.reportId = nonExistingReportId

    // An error
    let nonExistingReportException = new InstanceNotFoundException('Non existent report', 'person.reportId', person.reportId)

    spyOn(reportService, 'findById').andCallFake(function (anyUserId, anyReportId, callback) {
      callback(null, nonExistingReportException)
    })

    spyOn(teamService, 'findById')

    spyOn(authService, 'findById')

    spyOn(PersonDao, 'create')

    personService.create(refereeUserId, person.mame, person.cardId, person.dorsal,
      person.avatarUrl, person.isCalled, person.isStaff,
      person.reportId, person.teamId, person.userId,
      (person, err) => {
        expect(err).toEqual(nonExistingReportException)
        expect(person).toBe(null)
        expect(err).not.toBe(null)
    })

    expect(reportService.findById).toHaveBeenCalled()
    expect(teamService.findById).not.toHaveBeenCalled()
    expect(authService.findById).not.toHaveBeenCalled()
    expect(PersonDao.create).not.toHaveBeenCalled()

  })

  it('A Person cant be created with non existing Team', function () {

    let nonExistingTeamId = 1
    let refereeUserId = 1

    // Person with non existing Report
    let person = defaultPerson
    person.teamId = nonExistingTeamId

    // An error
    let nonExistingTeamException = new InstanceNotFoundException('Non existent team', 'person.teamId', person.teamId)

    spyOn(reportService, 'findById').andCallFake(function (anyUserId, anyReportId, callback) {
      callback(defaultReport, null)
    })

    spyOn(teamService, 'findById').andCallFake(function (anyTeamId, callback) {
      callback(null, nonExistingTeamException)
    })

    spyOn(authService, 'findById')

    spyOn(PersonDao, 'create')

    personService.create(refereeUserId, person.mame, person.cardId, person.dorsal,
      person.avatarUrl, person.isCalled, person.isStaff,
      person.reportId, person.teamId, person.userId,
      (person, err) => {
        expect(err).toEqual(nonExistingTeamException)
        expect(person).toBe(null)
        expect(err).not.toBe(null)
    })

    expect(reportService.findById).toHaveBeenCalled()
    expect(teamService.findById).toHaveBeenCalled()
    expect(authService.findById).not.toHaveBeenCalled()
    expect(PersonDao.create).not.toHaveBeenCalled()

  })

  it('A Person cant be created with non existing User', function () {

        let nonExistingUserId = 1
        let refereeUserId = 1

        // Person with non existing User
        let person = defaultPerson
        person.userId = nonExistingUserId

        // An error
        let nonExistingUserException = new InstanceNotFoundException('Non existent user', 'person.userId', person.userId)

        spyOn(reportService, 'findById').andCallFake(function (anyUserId, anyReportId, callback) {
          callback(defaultReport, null)
        })

        spyOn(teamService, 'findById').andCallFake(function (anyTeamId, callback) {
          callback(defaultTeam, null)
        })

        spyOn(authService, 'findById').andCallFake(function (anyUserId, callback) {
          callback(null, nonExistingUserException)
        })

        spyOn(PersonDao, 'create')

        personService.create(refereeUserId, person.mame, person.cardId, person.dorsal,
          person.avatarUrl, person.isCalled, person.isStaff,
          person.reportId, person.teamId, person.userId,
          (person, err) => {
            expect(err).toEqual(nonExistingUserException)
            expect(person).toBe(null)
            expect(err).not.toBe(null)
        })

        expect(reportService.findById).toHaveBeenCalled()
        expect(teamService.findById).toHaveBeenCalled()
        expect(authService.findById).toHaveBeenCalled()
        expect(PersonDao.create).not.toHaveBeenCalled()
  })

  it('A Person can be created with a null userId as a temporal Person', function () {

    let nullUserId = null
    let refereeUserId = 1

    // Person with null userId
    let person = defaultPerson
    person.userId = nullUserId

    spyOn(reportService, 'findById').andCallFake(function (anyUserId, anyReportId, callback) {
      callback(defaultReport, null)
    })

    spyOn(teamService, 'findById').andCallFake(function (anyTeamId, callback) {
      callback(defaultTeam, null)
    })

    spyOn(authService, 'findById')

    spyOn(PersonDao, 'create').andCallFake(function (name, cardId, dorsal, avatarUrl, isCalled, isStaff, reportId, teamId, userId, callback) {
      callback(person, null)
    })

    personService.create(refereeUserId, person.mame, person.cardId, person.dorsal,
      person.avatarUrl, person.isCalled, person.isStaff,
      person.reportId, person.teamId, person.userId,
      (p, err) => {
        expect(p).toEqual(person)
        expect(p).not.toBe(null)
        expect(err).toBe(null)
    })

    expect(reportService.findById).toHaveBeenCalled()
    expect(teamService.findById).toHaveBeenCalled()
    expect(authService.findById).not.toHaveBeenCalled()
    expect(PersonDao.create).toHaveBeenCalled()

  })

})


describe('Update Person', function () {

  beforeEach(function () {
    defaultPerson = new Person(null, '', '', '', '', false, false, '', '', '')
    defaultNewPerson = new Person(null, 'New person name', '', '', '', false, false, '', '', '')
    reportService = new ReportService(jasmine.createSpy('PersonService'), jasmine.createSpy('TeamService'), jasmine.createSpy('EventService'), jasmine.createSpy('SignService'))
    teamService = new TeamService()
    refereeService = new RefereeService()
    authService = new AuthService(jasmine.createSpy('RefereeService'))
    eventService = new EventService(jasmine.createSpy('ReportService'), jasmine.createSpy('PersonService'), jasmine.createSpy('TeamService'))
    personService = new PersonService(reportService, teamService, authService, eventService)
  })

  it('Update a Person with valid parameters', function () {

    // A valid Person
    let person = defaultPerson

    // A valid new Person
    let newPerson = defaultNewPerson

    spyOn(personService, 'findByPersonIdReportIdAndTeamId').andCallFake(function (anyPersonId, anyReportId, anyTeamId, callback) {
      callback(person, null)
    })

    spyOn(PersonDao, 'update').andCallFake(function (personId, name, cardId, dorsal, avatarUrl, isCalled, isStaff, reportId, teamId, userId, oldPerson, callback) {
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

    expect(personService.findByPersonIdReportIdAndTeamId).toHaveBeenCalledWith(person._id, person.reportId, person.teamId, jasmine.any(Object))
    expect(PersonDao.update).toHaveBeenCalled()

  })

  it('A Person cant be created if it doesnt exist', function () {

    // A non existing Person
    let newPerson = defaultPerson

    // An error
    let nonExistingUserException = new InstanceNotFoundException('Non existent person', 'personId', newPerson._id)

    spyOn(personService, 'findByPersonIdReportIdAndTeamId').andCallFake(function (anyPersonId, anyReportId, anyTeamId, callback) {
      callback(null, nonExistingUserException)
    })

    spyOn(PersonDao, 'update')

    personService.update(newPerson._id, newPerson.name, newPerson.cardId, newPerson.dorsal,
      newPerson.avatarUrl, newPerson.isCalled, newPerson.isStaff,
      newPerson.reportId, newPerson.teamId, newPerson.teamId, newPerson.userId,
      (p, err) => {
        expect(p).toBe(null)
        expect(err).toEqual(nonExistingUserException)
        expect(err).not.toBe(null)
    })

    expect(personService.findByPersonIdReportIdAndTeamId).toHaveBeenCalledWith(newPerson._id,
      newPerson.reportId, newPerson.teamId, jasmine.any(Object))

    expect(PersonDao.update).not.toHaveBeenCalled()

  })

})


let defaultNewPerson = null

describe('Set called value in Person', function () {

  beforeEach(function () {
    defaultPerson = new Person(null, '', '', '', '', false, false, '', '', '')
    defaultNewPerson = new Person(null, '', '', '', '', false, false, '', '', '')
    defaultUser = new User(null, 'username', 'password', 'avatarUrl', 'email', 'firstName', 'lastName', 'cardId', 'signKey')
    defaultTeam = new Team(null, 'Team name')
    defaultReport = new Report(null, '', '', false, defaultTeam, defaultTeam, [])
    reportService = new ReportService(jasmine.createSpy('PersonService'), jasmine.createSpy('TeamService'), jasmine.createSpy('EventService'), jasmine.createSpy('SignService'))
    teamService = new TeamService()
    refereeService = new RefereeService()
    authService = new AuthService(jasmine.createSpy('RefereeService'))
    eventService = new EventService(jasmine.createSpy('ReportService'), jasmine.createSpy('PersonService'), jasmine.createSpy('TeamService'))
    personService = new PersonService(reportService, teamService, authService, eventService)
  })

  it('A Person can be called if Person exists', function () {

    // A new called value
    let newCalledValue = true

    // A valid Person
    let person = defaultPerson

    let emptyEventsList = []

    // A Person with new called value
    let newPerson = defaultNewPerson
    newPerson.isCalled = newCalledValue

    spyOn(personService, 'findByPersonIdReportIdAndTeamId').andCallFake(function (anyPersonId, anyReportId, anyTeamId, callback) {
      callback(person, null)
    })

    spyOn(eventService, 'findAllByReportIdAndPersonId')

    spyOn(PersonDao, 'update').andCallFake(function (personId, name, cardId, dorsal, avatarUrl, isCalled, isStaff, reportId, teamId, userId, oldPerson, callback) {
      callback(newPerson, null)
    })

    personService.setCalledValue(person._id, person.reportId, person.teamId, newCalledValue, (p, err) => {
      expect(p).toEqual(newPerson)
      expect(p).not.toBe(null)
      expect(err).toBe(null)
    })

    expect(personService.findByPersonIdReportIdAndTeamId).toHaveBeenCalled()
    expect(eventService.findAllByReportIdAndPersonId).not.toHaveBeenCalled()
    expect(PersonDao.update).toHaveBeenCalled()
  })

  it('A Person cant be uncalled if he has any event in this Report', function () {

    // A new uncalled value
    let newCalledValue = false

    // A valid Person
    let person = defaultPerson

    // An event where this person is involved
    let event = new EventElements.Event('event', '1', person, defaultTeam, 'goal', 1, 'cause', 1)

    // A list with some event inside
    let eventList = []
    eventList.push(event)

    // An error
    let existingElementsException = new ExistingElementsException('Existing events assigned to this person', 'personId', person._id)

    // Set PersonService findByPersonIdReportIdAndTeamId mock implementation
    spyOn(personService, 'findByPersonIdReportIdAndTeamId').andCallFake(function (anyPersonId, anyReportId, anyTeamId, callback) {
      callback(person, null)
    })

    spyOn(eventService, 'findAllByReportIdAndPersonId').andCallFake(function (anyReportId, anyPersonId, callback) {
      callback(eventList, null)
    })

    spyOn(PersonDao, 'update')

    personService.setCalledValue(person._id, person.reportId, person.teamId, newCalledValue, (p, err) => {
      expect(p).toBe(null)
      expect(err).not.toBe(null)
      expect(err).toEqual(existingElementsException)
    })

    expect(personService.findByPersonIdReportIdAndTeamId).toHaveBeenCalled()
    expect(eventService.findAllByReportIdAndPersonId).toHaveBeenCalled()
    expect(PersonDao.update).not.toHaveBeenCalled()

  })

  it('Called value cant be changed if Person doesnt exist', function () {

    // A new called value
    let newCalledValue = true

    // A valid Person
    let person = defaultPerson

    let emptyEventsList = []

    // An error
    let nonExistingPersonException = new InstanceNotFoundException('Non existent person', 'personId', person._id)

    spyOn(personService, 'findByPersonIdReportIdAndTeamId').andCallFake(function (anyPersonId, anyReportId, anyTeamId, callback) {
      callback(null, nonExistingPersonException)
    })

    spyOn(eventService, 'findAllByReportIdAndPersonId')

    spyOn(PersonDao, 'update')

    personService.setCalledValue(person._id, person.reportId, person.teamId, newCalledValue, (p, err) => {
      expect(p).toBe(null)
      expect(err).not.toBe(null)
      expect(err).toEqual(nonExistingPersonException)
    })

    expect(personService.findByPersonIdReportIdAndTeamId).toHaveBeenCalled()
    expect(eventService.findAllByReportIdAndPersonId).not.toHaveBeenCalled()
    expect(PersonDao.update).not.toHaveBeenCalled()

  })

})

describe('Set dorsal value in Person', function () {

  beforeEach(function () {
    defaultPerson = new Person(null, '', '', '', '', false, false, '', '', '')
    defaultNewPerson = new Person(null, '', '', '', '', false, false, '', '', '')
    defaultUser = new User(null, 'username', 'password', 'avatarUrl', 'email', 'firstName', 'lastName', 'cardId', 'signKey')
    defaultTeam = new Team(null, 'Team name')
    defaultReport = new Report(null, '', '', false, defaultTeam, defaultTeam, [])
    reportService = new ReportService(jasmine.createSpy('PersonService'), jasmine.createSpy('TeamService'), jasmine.createSpy('EventService'), jasmine.createSpy('SignService'))
    teamService = new TeamService()
    refereeService = new RefereeService()
    authService = new AuthService(jasmine.createSpy('RefereeService'))
    personService = new PersonService(reportService, teamService, authService)
  })

  it('Dorsal value must be changed if Person exists', function () {
    // A new dorsal value
    let newDorsalValue = '1'

    // A valid Person
    let person = defaultPerson

    // A valid modified Person
    let newPerson = defaultNewPerson
    newPerson.dorsal = newDorsalValue

    spyOn(personService, 'findByPersonIdReportIdAndTeamId').andCallFake(function (anyPersonId, anyReportId, anyTeamId, callback) {
      callback(person, null)
    })

    spyOn(PersonDao, 'setCalledValue').andCallFake(function (personId, reportId, teamId, newValue, oldPerson, callback) {
      callback(newPerson, null)
    })

    personService.setDorsal(person._id, person.reportId, person.teamId, newDorsalValue, (p, err) => {
      expect(p).toEqual(newPerson)
      expect(p).not.toBe(null)
      expect(err).toBe(null)
    })

    expect(personService.findByPersonIdReportIdAndTeamId).toHaveBeenCalled()
    expect(PersonDao.setCalledValue).toHaveBeenCalled()

  })

  it('Dorsal value cant be changed if Person doesnt exist', function () {
    // A new dorsal value
    let newDorsalValue = '1'

    // A valid Person
    let person = defaultPerson

    // An error
    let nonExistingPersonException = new InstanceNotFoundException('Non existent person', 'personId', person._id)

    spyOn(personService, 'findByPersonIdReportIdAndTeamId').andCallFake(function (anyPersonId, anyReportId, anyTeamId, callback) {
      callback(null, nonExistingPersonException)
    })

    spyOn(PersonDao, 'setCalledValue')

    personService.setDorsal(person._id, person.reportId, person.teamId, newDorsalValue, (p, err) => {
      expect(err).toEqual(nonExistingPersonException)
      expect(err).not.toBe(null)
      expect(p).toBe(null)
    })

    expect(personService.findByPersonIdReportIdAndTeamId).toHaveBeenCalled()
    expect(PersonDao.setCalledValue).not.toHaveBeenCalled()

  })

})

describe('Delete Person', function () {

  beforeEach(function () {
    defaultPerson = new Person(null, '', '', '', '', false, false, '', '', '')
    defaultUser = new User(null, 'username', 'password', 'avatarUrl', 'email', 'firstName', 'lastName', 'cardId', 'signKey')
    defaultTeam = new Team(null, 'Team name')
    defaultReport = new Report(null, '', '', false, defaultTeam, defaultTeam, [])
    reportService = new ReportService(jasmine.createSpy('PersonService'), jasmine.createSpy('TeamService'), jasmine.createSpy('EventService'), jasmine.createSpy('SignService'))
    teamService = new TeamService()
    refereeService = new RefereeService()
    authService = new AuthService(jasmine.createSpy('RefereeService'))
    eventService = new EventService(jasmine.createSpy('ReportService'), jasmine.createSpy('PersonService'), jasmine.createSpy('TeamService'))
    personService = new PersonService(reportService, teamService, authService, eventService)
  })

  it('A Person must be deleted if it exists and Person doesnt have any assigned event', function () {

    // A valid Person
    let person = defaultPerson

    let emptyEventsList = []

    spyOn(personService, 'findByPersonIdReportIdAndTeamId').andCallFake(function (anyPersonId, anyReportId, anyTeamId, callback) {
      callback(person, null)
    })

    spyOn(eventService, 'findAllByReportIdAndPersonId').andCallFake(function (anyReportId, anyPersonId, callback) {
      callback(emptyEventsList, null)
    })

    spyOn(PersonDao, 'deletePerson').andCallFake(function (anyPerson, callback) {
      callback(jasmine.any(Object), null)
    })

    personService.deletePerson(person._id, person.reportId, person.teamId, (p, err) => {
      expect(p).toEqual(person)
      expect(p).not.toBe(null)
      expect(err).toBe(null)
    })

    expect(personService.findByPersonIdReportIdAndTeamId).toHaveBeenCalled()
    expect(eventService.findAllByReportIdAndPersonId).toHaveBeenCalled()
    expect(PersonDao.deletePerson).toHaveBeenCalled()

  })

  it('A Person cant be deleted if it have any assigned event', function () {

    // A valid Person
    let person = defaultPerson

    let nonEmptyList = [jasmine.any(Object)]

    let exception = new ExistingElementsException('Existing events assigned to this person', 'personId', person._id)

    spyOn(personService, 'findByPersonIdReportIdAndTeamId').andCallFake(function (anyPersonId, anyReportId, anyTeamId, callback) {
      callback(person, null)
    })

    spyOn(eventService, 'findAllByReportIdAndPersonId').andCallFake(function (anyReportId, anyPersonId, callback) {
      callback(nonEmptyList, null)
    })

    spyOn(PersonDao, 'deletePerson').andCallFake(function (anyPerson, callback) {
      callback(jasmine.any(Object), null)
    })

    personService.deletePerson(person._id, person.reportId, person.teamId, (p, err) => {
      expect(p).toBe(null)
      expect(err).not.toBe(null)
      expect(err).toEqual(exception)
    })

    expect(personService.findByPersonIdReportIdAndTeamId).toHaveBeenCalled()
    expect(eventService.findAllByReportIdAndPersonId).toHaveBeenCalled()
    expect(PersonDao.deletePerson).not.toHaveBeenCalled()

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

    spyOn(PersonDao, 'deletePerson')

    personService.deletePerson(person._id, person.reportId, person.teamId, (p, err) => {
      expect(err).toEqual(nonExistingPersonException)
      expect(err).not.toBe(null)
      expect(p).toBe(null)
    })

    expect(personService.findByPersonIdReportIdAndTeamId).toHaveBeenCalled()
    expect(PersonDao.deletePerson).not.toHaveBeenCalled()

  })

})
