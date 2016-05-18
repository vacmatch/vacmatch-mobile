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
import {FormattedMessage, injectIntl, intlShape, defineMessages} from 'react-intl'

let RaisedButton = mui.RaisedButton
let TextField = mui.TextField

const messages = defineMessages({
  incidencesUpdated: {
    id: 'report.incidences.incidencesUpdated',
    description: 'Message for snack bar to be showed when incidences were updated',
    defaultMessage: 'Report incidences updated'
  }
})

let Incidences = React.createClass({
  mixins: [
    Reflux.connect(ReportStore, 'report'),
    Reflux.connect(ErrorHandlerStore, 'error'),
    Reflux.connect(SnackBarStore, 'snack')
  ],

  propTypes: {
    intl: intlShape.isRequired
  },

  componentWillUpdate: function () {
    // Update new incidences value
    this.refs.incidences.setValue(this.state.report.report.incidences)
  },

  handleAddIncidences: function () {
    let newIncidences = this.refs.incidences.getValue()
    let report = this.state.report.report
    // Add/update incidences in report
    ReportActions.editReport(report._id, report.date, report.location, report.status,
      report.localTeam, report.visitorTeam, newIncidences, (report, err) => {
        if (err !== null) {
          ErrorActions.setError(err)
        } else {
          SnackBarActions.setElement(this.props.intl.formatMessage(messages.incidencesUpdated))
        }
      })
  },

  render: function () {
    return <div style={style.center}>
      <TextField ref='incidences'
        key={'incidences-field'}
        hintText={
          <FormattedMessage
              id='report.incidences.addIncidences'
              description='Text input to add incidences to this match'
              defaultMessage='Add incidences'
          />
        }
        floatingLabelText={
          <FormattedMessage
              id='report.incidences.modifyIncidences.short'
              description='Text input to modify incidences to this match'
              defaultMessage='Modify incidences'
          />
        }
        multiLine={true}
        defaultValue={this.state.report.report.incidences}/>
      <br/>
      <RaisedButton label={
        <FormattedMessage
            id='report.incidences.modifyIncidences'
        />
      } primary={true}
        onClick={this.handleAddIncidences} />
    </div>
  }

})

module.exports = injectIntl(Incidences)
