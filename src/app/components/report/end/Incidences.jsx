import React from 'react'
import Reflux from 'reflux'
import mui from 'material-ui'
import style from '../../../../assets/style/generic-style'
import ReportStore from '../../../stores/ReportStore'
import ReportActions from '../../../actions/ReportActions'
import ErrorActions from '../../../actions/ErrorActions'
import ErrorHandlerStore from '../../../stores/utils/ErrorHandlerStore'
import SnackBarActions from '../../../actions/SnackBarActions'
import SnackBarStore from '../../../stores/SnackBarStore'

let RaisedButton = mui.RaisedButton
let TextField = mui.TextField

let Incidences = React.createClass({
  mixins: [
    Reflux.connect(ReportStore, 'report'),
    Reflux.connect(ErrorHandlerStore, 'error'),
    Reflux.connect(SnackBarStore, 'snack')
  ],

  componentWillUpdate: function () {
    // Update new incidences value
    this.refs.incidences.setValue(this.state.report.report.incidences)
  },

  handleAddIncidences: function () {
    let newIncidences = this.refs.incidences.getValue()
    let report = this.state.report.report
    // Add/update incidences in report
    ReportActions.editReport(report._id, report.date, report.location, report.hasFinished,
      report.localTeam, report.visitorTeam, newIncidences, (report, err) => {
        if (err !== null) {
          ErrorActions.setError(err)
        } else {
          SnackBarActions.setElement('Report incidences updated')
        }
      })
  },

  render: function () {
    return <div style={style.center}>
      <TextField ref='incidences'
        key={'incidences-field'}
        hintText='Add incidences'
        floatingLabelText='Modify incidences'
        multiLine={true}
        defaultValue={this.state.report.report.incidences}/>
      <br/>
      <RaisedButton label='Modify incidences'
        primary={true}
        onClick={this.handleAddIncidences} />
    </div>
  }

})

module.exports = Incidences
