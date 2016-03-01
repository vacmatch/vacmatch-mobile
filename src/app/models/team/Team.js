
class Team {

  constructor (type, name) {
    this.databaseType = type ? type : 'team'
    this.name = name ? name : ''
  }

}

module.exports = Team
