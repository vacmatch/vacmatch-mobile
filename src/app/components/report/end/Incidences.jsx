//
// Copyright (c) 2016 by VACmatch
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//

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
