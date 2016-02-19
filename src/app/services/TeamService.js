import GenericService from './GenericService'
import Team from '../models/team/Team'

let TeamService = {

  /**
   * Returns the type of this service
   * @returns {String} The type identifier
   */
  getType: function () {
    return 'team'
  },

  /**
   * Find a Team by id
   * @param {Boolean} teamId Team identifier
   * @param {reportListCallback} callback A callback that returns the Team element or error
   */
  findById: function (teamId, callback) {
    GenericService.findById(teamId, callback)
  },

  /**
    * Create a Team
    * @param {String} teamName The name of the new Team
    * @param {teamCallback} callback A callback that returns the created Team or error
    */
  create: function (teamName, callback) {
    let team = new Team(this.getType(), teamName)
    // Save it
    GenericService.create(team, callback)
  }

}

module.exports = TeamService
