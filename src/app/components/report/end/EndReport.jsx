import React from 'react'
import Reflux from 'reflux'
import mui from 'material-ui'

import ReportStore from '../../../stores/ReportStore'
import ReportActions from '../../../actions/ReportActions'
import SportStore from '../../../stores/SportStore'
import MenuStore from '../../../stores/MenuStore'
import MenuActions from '../../../actions/MenuActions'

let Tabs = mui.Tabs
let Tab = mui.Tab
let FlatButton = mui.FlatButton

let EndReport = React.createClass({
  mixins: [
    Reflux.connect(ReportStore, 'report'),
    Reflux.connect(SportStore, 'sport'),
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
    ReportActions.updateReport(this.props.params.reportId, function () {})
  },

  render: function () {
    return <Tabs>
      <Tab label='Referee'>
        <FlatButton label='End match' />
      </Tab>
      <Tab label={this.state.report.localTeam.teamName}></Tab>
      <Tab label={this.state.report.visitorTeam.teamName}></Tab>
    </Tabs>
  }

})

module.exports = EndReport
