import React from 'react'
import Reflux from 'reflux'

import PersonListStore from '../../stores/PersonListStore'
import ReportActions from '../../actions/ReportActions'
import ReportStore from '../../stores/ReportStore'
import PersonActions from '../../actions/PersonActions'

import TabList from '../generic/TabList'
import CallItem from './CallItem'

let CallList = React.createClass({
  mixins: [
    Reflux.connect(PersonListStore, 'personList'),
    Reflux.connect(ReportStore, 'report')
  ],

  propTypes: {
    params: React.PropTypes.shape({
      reportId: React.PropTypes.string
    })
  },

  componentWillMount: function () {
    // Update team names from this report
    ReportActions.updateReport(this.props.params.reportId, () => {
      // Update players lists (local and visitor)
      ReportActions.updatePlayers(this.props.params.reportId,
        this.state.report.localTeam.id, this.state.report.visitorTeam.id)
    })
  },

  callToggle: function (personId, teamId, toggleEvent, newValue) {
    // Save toggle and update state
    PersonActions.toggleCallPerson(personId, this.props.params.reportId, teamId, newValue)
  },

  render: function () {
    let tabs =
      [
        this.state.report.localTeam.teamName,
        this.state.report.visitorTeam.teamName
      ]

    let items = [
      [
        this.state.personList.localPeople.map(person => {
          return <CallItem key={'local-' + person.id} person={person} handleCallToggle={this.callToggle}/>
        })
      ],
      [
        this.state.personList.visitorPeople.map(person => {
          return <CallItem key={'visitor-' + person.id} person={person} handleCallToggle={this.callToggle}/>
        })
      ]
    ]
    return <TabList tabsNames={tabs} tabsItems={items}/>
  }

})

module.exports = CallList
