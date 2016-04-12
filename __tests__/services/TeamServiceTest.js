jest.dontMock('../../src/app/services/TeamService')

let TeamService = require('../../src/app/services/TeamService')

let Team = require('../../src/app/models/team/Team')
let InvalidParametersException = require('../../src/app/models/exception/InvalidParametersException')

let TeamDao = require('../../src/app/daos/TeamDao')

let defaultTeam = null
let teamService = null

describe('create', function () {

  beforeEach(function () {
    defaultTeam = new Team(null, 'Fulanos FC')
    teamService = new TeamService()
  })

  it('Create a new team with valid parameters', function () {

    let team = defaultTeam

    spyOn(TeamDao, 'create').andCallFake(function (defaultTeamName, callback) {
      callback(defaultTeam, null)
    })

    teamService.create(team.name, (team, err) => {
      expect(team).toBe(team)
      expect(team).not.toBe(null)
      expect(err).toBe(null)
    })

    expect(TeamDao.create).toHaveBeenCalled()
  })

  it('Create a new team with null team name', function () {

    let team = defaultTeam
    team.name = null

    let defaultErr = new InvalidParametersException('Invalid team name', 'teamName', team.name)

    spyOn(TeamDao, 'create')

    teamService.create(team.name, (t, err) => {
      expect(t).toBe(null)
      expect(err).not.toBe(null)
      expect(err).toEqual(defaultErr)
    })

    expect(TeamDao.create).not.toHaveBeenCalled()
  })
})
