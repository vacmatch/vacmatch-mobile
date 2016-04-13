
class Team {

  constructor (id, name, teamId) {
    this._id = id
    this.databaseType = 'team'
    this.name = name
    // Id from remote DB
    this.teamId = teamId ? teamId : null
  }

}

module.exports = Team
