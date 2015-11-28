import React from 'react'
import Reflux from 'reflux'
import { History } from 'react-router'

import PersonListStore from '../../../stores/PersonListStore'
import ReportStore from '../../../stores/ReportStore'
import ReportActions from '../../../actions/ReportActions'
import SportActions from '../../../actions/SportActions'

import TabList from '../../generic/TabList'
import urls from '../../../api/urls'

import SportStore from '../../../stores/SportStore'

let PersonList = React.createClass({
  mixins: [
    Reflux.connect(PersonListStore, 'personList'),
    Reflux.connect(ReportStore, 'report'),
    Reflux.connect(SportStore, 'sport'),
    History
  ],

  propTypes: {
    params: React.PropTypes.shape({
      reportId: React.PropTypes.string,
      eventType: React.PropTypes.string
    })
  },

  _handleEventSubmit: function () {
    // TODO: Add a snackbar
    this.history.pushState(null, urls.report.show(this.props.params.reportId))
  },

  componentWillMount: function () {
    // Update players lists (local and visitor)
    ReportActions.updatePlayers(this.props.params.reportId,
      this.state.report.localTeam.id, this.state.report.visitorTeam.id)
    // Update component for the required eventType
    SportActions.updateEventComponent(this.props.params.eventType)
    // Update team names from this report
    ReportActions.updateReportTeams(this.props.params.reportId)
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
          let element = this.state.sport.eventComponent
          let properties =
            {
              key: 'event-' + person.id,
              person: person,
              handleEventSubmit: this._handleEventSubmit
            }
          return React.cloneElement(element, properties)
        })
      ],
      [
        this.state.personList.visitorPeople.map(person => {
          let element = this.state.sport.eventComponent
          let properties =
            {
              key: 'event-' + person.id,
              person: person,
              handleEventSubmit: this._handleEventSubmit
            }
          return React.cloneElement(element, properties)
        })
      ]
    ]
    return <TabList tabsNames={tabs} tabsItems={items}/>
  }

})

module.exports = PersonList
