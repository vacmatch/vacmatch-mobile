import GenericService from './GenericService'
import Team from '../models/team/Team'
import InvalidParametersException from '../models/exception/InvalidParametersException'

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
    if ((teamName === null) || (teamName === undefined)) {
      return callback(null, new InvalidParametersException('Invalid team name', 'teamName', teamName))
    }
    let team = new Team(null, this.getType(), teamName)
    // Save it
    GenericService.create(team, callback)
  },

  /**
    * Delete a Team
    * @param {String} teamId The Team identifier
    * @param {teamCallback} callback A callback that returns if team was removed
    */
  delete: function (teamId, callback) {
    this.findById(teamId, function (team, err) {
      if (err !== null) {
        return callback(null, err)
      }
      GenericService.remove(team, callback)
    })
  }
}

module.exports = TeamService
