import React from 'react'
import Reflux from 'reflux'
import mui from 'material-ui'

import ReportStore from '../../../stores/ReportStore'
import ReportActions from '../../../actions/ReportActions'
import MenuStore from '../../../stores/MenuStore'
import MenuActions from '../../../actions/MenuActions'

import AuthenticatedComponent from '../../generic/AuthenticatedComponent'
import RefereeTab from './RefereeTab'

let Tabs = mui.Tabs
let Tab = mui.Tab

let EndReport = React.createClass({
  mixins: [
    Reflux.connect(ReportStore, 'report'),
    Reflux.connect(MenuStore, 'menu')
  ],

  propTypes: {
    params: React.PropTypes.shape({
      reportId: React.PropTypes.string
    })
  },

  componentWillMount: function () {
    let rightMenuElements = []
    // Set right menu buttons in AppBar
    MenuActions.setRightMenu(rightMenuElements)
    // Update report state
    ReportActions.updateReport(this.props.params.reportId)
  },

  render: function () {
    return <Tabs>
      <Tab label='Referee'>
        <RefereeTab handleAddIncidences={this.handleAddIncidences}/>
      </Tab>
      <Tab label={this.state.report.localTeam.teamName}></Tab>
      <Tab label={this.state.report.visitorTeam.teamName}></Tab>
    </Tabs>
  }

})

module.exports = AuthenticatedComponent(EndReport)
