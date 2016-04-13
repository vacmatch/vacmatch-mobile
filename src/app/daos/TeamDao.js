import GenericDao from './GenericDao'
import Team from '../models/team/Team'

let TeamDao = {

  databaseType: 'team',

  findById: function (teamId, callback) {
    GenericDao.findById(teamId, callback)
  },

  create: function (teamName, callback) {
    let team = new Team(null, teamName)
    // Save it
    GenericDao.create(team, callback)
  },

  deleteTeam: function (team, callback) {
    GenericDao.remove(team, callback)
  }
}

module.exports = TeamDao
