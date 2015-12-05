import PouchDB from 'pouchdb'

var db = new PouchDB('players')

let PersonService = {

  findByReportIdAndTeamId: function (reportId, team, callback) {
    let elements = [
      {
        'id': '1',
        'name': 'Fulano local',
        'dorsal': '1',
        'teamId': '1',
        'teamName': 'Carnicería Ángel',
        'reportId': '1',
        'avatarUrl': 'http://lorempixel.com/200/200/sports/'
      }
    ]
    callback(null, elements)
  }
}

module.exports = PersonService
