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

import ReportStore from '../../../stores/ReportStore'
import ReportActions from '../../../actions/ReportActions'
import MenuStore from '../../../stores/MenuStore'
import MenuActions from '../../../actions/MenuActions'
import PersonListStore from '../../../stores/PersonListStore'
import SignStore from '../../../stores/SignStore'
import SignActions from '../../../actions/SignActions'
import ErrorActions from '../../../actions/ErrorActions'
import ErrorHandlerStore from '../../../stores/utils/ErrorHandlerStore'
import { History } from 'react-router'
import {intlShape, injectIntl, defineMessages} from 'react-intl'

import AuthenticatedComponent from '../../generic/AuthenticatedComponent'
import Incidences from './Incidences'
import Sign from './Sign'
import urls from '../../../api/urls'
import LeftMenuData from '../../../stores/utils/LeftMenuData'

let Tabs = mui.Tabs
let Tab = mui.Tab

const messages = defineMessages({
  eventsItem: {
    id: 'report.endReport.events',
    description: 'Events text for option in right menu',
    defaultMessage: 'Events'
  },
  signTabTitle: {
    id: 'report.endReport.signTab.title',
    description: 'Text title in tabs for sign reports',
    defaultMessage: 'Sign report {element}'
  },
  refereeLabel: {
    id: 'report.endReport.referee',
    description: 'Referee text to show as title in sign tab',
    defaultMessage: 'Referee'
  }
})

let EndReport = React.createClass({
  mixins: [
    Reflux.connect(ReportStore, 'report'),
    Reflux.connect(PersonListStore, 'personLists'),
    Reflux.connect(SignStore, 'signatures'),
    Reflux.connect(MenuStore, 'menu'),
    Reflux.connect(ErrorHandlerStore, 'error'),
    History
  ],

  propTypes: {
    params: React.PropTypes.shape({
      reportId: React.PropTypes.string
    }),
    intl: intlShape.isRequired
  },

  _handleBackEvent: function () {
    this.history.pushState(null, urls.report.show(this.props.params.reportId))
  },

  componentWillMount: function () {
    let rightMenuElements = [
      {text: this.props.intl.formatMessage(messages.eventsItem), url: urls.event.list(this.props.params.reportId)}
    ]
    // Set right menu buttons in AppBar
    MenuActions.setRightMenu(rightMenuElements)

    let menuItems = []
    let backActionName = LeftMenuData.getBackActionName()
    let icon = LeftMenuData.getBackIcon()
    // Add menu default action
    MenuActions.addActionFunction(backActionName, this._handleBackEvent, () => {
      // Set left menu buttons
      MenuActions.setLeftMenu(icon, backActionName, menuItems)
    })

    // Update report state
    ReportActions.updateReport(this.props.params.reportId, (report, err) => {
      if (err !== null) {
        ErrorActions.setError(err)
      } else {
        ReportActions.updatePlayers(this.state.report.report._id, this.state.report.report.localTeam._id, this.state.report.report.visitorTeam._id, (reportId, err) => {
          if (err !== null) {
            ErrorActions.setError(err)
          } else {
            SignActions.updateSignatures(this.state.report.report._id, (signatures, err) => {
              if (err !== null) {
                ErrorActions.setError(err)
              }
            })
          }
        })
      }
    })
  },

  componentWillUnmount: function () {
    MenuActions.clearRightMenu()
  },

  render: function () {
    let refereeTitle = this.props.intl.formatMessage(messages.signTabTitle, {element: this.props.intl.formatMessage(messages.refereeLabel)})
    let localTitle = this.props.intl.formatMessage(messages.signTabTitle, {element: this.state.report.report.localTeam.name})
    let visitorTitle = this.props.intl.formatMessage(messages.signTabTitle, {element: this.state.report.report.visitorTeam.name})
    let refereeLabel = this.props.intl.formatMessage(messages.refereeLabel)

    return <Tabs>
      <Tab label={refereeLabel}>
        <Incidences handleAddIncidences={this.handleAddIncidences}/>
        <Sign title={refereeTitle}
          personList={this.state.report.report.refereeList}
          reportId={this.state.report.report._id}
          teamId={null}/>
      </Tab>
      <Tab label={this.state.report.report.localTeam.name}>
        <Sign title={localTitle}
          personList={this.state.personLists.localPeople}
          reportId={this.state.report.report._id}
          teamId={this.state.report.report.localTeam._id}/>
      </Tab>
      <Tab label={this.state.report.report.visitorTeam.name}>
        <Sign title={visitorTitle}
          personList={this.state.personLists.visitorPeople}
          reportId={this.state.report.report._id}
          teamId={this.state.report.report.visitorTeam._id}/>
      </Tab>
    </Tabs>
  }

})

module.exports = AuthenticatedComponent(injectIntl(EndReport))
