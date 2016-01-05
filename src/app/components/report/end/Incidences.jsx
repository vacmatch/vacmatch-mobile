import React from 'react'
import Reflux from 'reflux'
import mui from 'material-ui'
import style from '../../../../assets/style/generic-style'
import ReportStore from '../../../stores/ReportStore'
import ReportActions from '../../../actions/ReportActions'

let RaisedButton = mui.RaisedButton
let TextField = mui.TextField
let Snackbar = mui.Snackbar

let Incidences = React.createClass({
  mixins: [
    Reflux.connect(ReportStore, 'report')
  ],

  getInitialState: function () {
    return {
      snackbarMessage: 'Incidences were updated'
    }
  },

  componentWillUpdate: function () {
    // Update new incidences value
    this.refs.incidences.setValue(this.state.report.incidences)
  },

  handleAddIncidences: function () {
    let newIncidences = this.refs.incidences.getValue()
    let report = this.state.report
    // Add/update incidences in report
    ReportActions.editReport(report._id, report.date, report.location, report.hasFinished,
      report.localTeam, report.visitorTeam, newIncidences, (report, err) => {
        if (err !== null) {
          this.setState({snackbarMessage: err})
        }
        this.refs.snack.show()
      })
  },

  render: function () {
    return <div style={style.center}>
      <TextField ref='incidences'
        key={'incidences-field'}
        hintText='Add incidences'
        floatingLabelText='Modify incidences'
        multiLine={true}
        defaultValue={this.state.report.incidences}/>
      <br/>
      <RaisedButton label='Modify incidences'
        primary={true}
        onClick={this.handleAddIncidences} />
      <Snackbar
        ref='snack'
        message={this.state.snackbarMessage}
        autoHideDuration={4000} />
    </div>
  }

})

module.exports = Incidences
