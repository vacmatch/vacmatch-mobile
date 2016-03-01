
class Team {

  constructor (type, teamName) {
    this.databaseType = type ? type : 'team'
    this.teamName = teamName ? teamName : ''
  }

}

module.exports = Team
