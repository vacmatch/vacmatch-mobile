
class Team {

  constructor (id, type, name, teamId) {
    this._id = id
    // Id from remote DB
    this.teamId = teamId ? teamId : null
    this.databaseType = type ? type : 'team'
    this.name = name ? name : ''
  }

}

module.exports = Team
