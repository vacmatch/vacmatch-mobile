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

import AuthenticatedComponent from '../../generic/AuthenticatedComponent'
import Incidences from './Incidences'
import Sign from './Sign'

let Tabs = mui.Tabs
let Tab = mui.Tab

let EndReport = React.createClass({
  mixins: [
    Reflux.connect(ReportStore, 'report'),
    Reflux.connect(PersonListStore, 'personLists'),
    Reflux.connect(SignStore, 'signatures'),
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
    ReportActions.updateReport(this.props.params.reportId, () => {
      ReportActions.updatePlayers(this.state.report.report._id, this.state.report.report.localTeam._id, this.state.report.report.visitorTeam._id, () => {
        SignActions.updateSignatures(this.state.report.report._id, () => {
        })
      })
    })
  },

  render: function () {
    let refereeTitle = 'Sign report referee'
    let localTitle = 'Sign report ' + this.state.report.report.localTeam.name
    let visitorTitle = 'Sign report ' + this.state.report.report.visitorTeam.name
    return <Tabs>
      <Tab label='Referee'>
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

module.exports = AuthenticatedComponent(EndReport)
