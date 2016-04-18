import SignDao from '../daos/SignDao'

class SignService {

  constructor (authService, reportService, personService, teamService) {
    this.AuthService = authService
    this.ReportService = reportService
    this.PersonService = personService
    this.TeamService = teamService
  }

  /**
   * Find a Signature by id
   * @param {String} signId Sinature identifier
   * @param {signatureCallback} callback A callback that returns the Signature element or error
   */
  findById (signId, callback) {
    SignDao.findById(signId, callback)
  }

  /**
   * Find all Signatures in a Report by report id
   * @param {String} reportId Report identifier
   * @param {signatureListCallback} callback A callback that returns the Signature list
   */
  findAllByReportId (reportId, callback) {
    SignDao.findAllByReportId(reportId, callback)
  }

  /**
   * Create a Signature
   * @param {String} userId User identifier that creates the signature
   * @param {String} reportId Report identifier which is signed
   * @param {String} stringToHash A text with information about the game to create a checksum
   * @param {Number} timeStamp The time when the Report is signed
   * @param {String} personId The signer Person identifier
   * @param {String} name The signer Person name
   * @param {String} teamId The Team from the signer Person
   * @param {String} fedId The Federation id from the signer Person (null if the signer is not an User)
   * @param {signatureCallback} callback A callback that returns the created Signature or error
   */
  create (userId, reportId, stringToHash, timeStamp, personId, name, teamId, fedId, callback) {
    this.AuthService.findById(userId, (data, err) => {
      if (err !== null) {
        return callback(null, err)
      }
      this.ReportService.findById(reportId, (data, err) => {
        if (err !== null) {
          return callback(null, err)
        }
        this.PersonService.findByPersonIdReportIdAndTeamId(personId, reportId, teamId, (data, err) => {
          if (err !== null) {
            return callback(null, err)
          }
          this.TeamService.findById(teamId, (data, err) => {
            if (err !== null) {
              return callback(null, err)
            }
            SignDao.create(userId, reportId, stringToHash, timeStamp, personId, name, teamId, fedId, callback)
          })
        })
      })
    })
  }

  /**
   * Delete a Signature
   * @param {String} signId Signature identifier
   * @param {signatureCallback} callback A callback that returns an object with
   * the deleted signId if the Signature was deleted
   */
  delete (signId, callback) {
    this.findById(signId, function (signature, err) {
      if (err === null) {
        // Remove it
        SignDao.deleteSignature(signature, callback)
      } else {
        callback(null, err)
      }
    })
  }

  /**
   * Delete all Signature from a Report
   * @param {String} reportId Report identifier
   * @param {signatureCallback} callback A callback that returns if Signatures were removed
   */
  deleteAllSignaturesByReportId (reportId, callback) {
    this.findAllByReportId(reportId, function (signatureList, err) {
      if (err !== null) {
        return callback(signatureList, err)
      }
      signatureList.map((sign) => {
        SignDao.deleteSignature(sign, function (res, err) {
          if (err !== null) {
            return callback(null, err)
          }
        })
      })
      callback(signatureList, err)
    })
  }
}

module.exports = SignService
