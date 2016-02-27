jest.dontMock('../../src/app/services/TeamService')

describe('create', function () {
  // Default elements
  var teamService = require('../../src/app/services/TeamService')
  var genericService = require('../../src/app/services/GenericService')
  let defaultTeamName = 'Fulanos FC'
  let defaultTeam = {
    databaseType: 'team',
    teamName: defaultTeamName
  }
  let defaultErr = "Error"

  it('Create a new team with valid parameters', function () {

    // Set GenericService.create mock implementation
    spyOn(genericService, 'create').andCallFake(function (defaultTeamName, callback) {
      // Returns a valid team
      callback(defaultTeam, null)
    })

    // Create the new team with correct parameters
    teamService.create(defaultTeamName, (team, err) => {
      expect(team).toBe(defaultTeam)
      expect(team).not.toBe(null)
      expect(err).toBe(null)
    })

    // Check if create was called in GenericService
    expect(genericService.create).toHaveBeenCalled()
  })

  it('Create a new team with null team name', function () {

    // Set GenericService.create mock
    spyOn(genericService, 'create')

    // Create the new team with null teamName paramter
    teamService.create(null, (team, err) => {
      expect(team).toBe(null)
      expect(err).not.toBe(null)
    })

    // Check if team wasn't created in GenericService
    expect(genericService.create).not.toHaveBeenCalled()
  })
})
