import React from 'react'
import Reflux from 'reflux'
import { History } from 'react-router'

import PersonListStore from '../../../stores/PersonListStore'
import ReportStore from '../../../stores/ReportStore'
import ReportActions from '../../../actions/ReportActions'
import EventActions from '../../../actions/EventActions'

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

  _handleEventSubmit: function (reportId, person, team, eventType, matchTime, cause) {
    // Add event to the db
    EventActions.addEvent(reportId, person, team, eventType, matchTime, cause, (event) => {
      // Update result in report
      ReportActions.updateResultFields(event, this.state.sport, () => {
        // Go to show report view
        this.history.pushState(null, urls.report.show(this.props.params.reportId))
      })
    })
  },

  componentWillMount: function () {
    // Update teams from this report
    ReportActions.updateReport(this.props.params.reportId, () => {
      // Update players lists (local and visitor)
      ReportActions.updatePlayers(this.props.params.reportId,
        this.state.report.localTeam.id, this.state.report.visitorTeam.id)
    })
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
          if (person.isCalled) {
            let event = this.state.sport.getEventByType(this.props.params.eventType)
            let properties =
              {
                key: 'eventLocal-' + person.id,
                reportId: this.props.params.reportId,
                matchTime: this.state.report.timer.ms,
                person: person,
                team: this.state.report.localTeam,
                eventTitle: event.title,
                eventSubtitle: event.subtitle,
                eventType: event.type,
                causeList: event.causes,
                handleEventSubmit: this._handleEventSubmit
              }
            return React.cloneElement(event.component, properties)
          }
        })
      ],
      [
        this.state.personList.visitorPeople.map(person => {
          if (person.isCalled) {
            let event = this.state.sport.getEventByType(this.props.params.eventType)
            let properties =
              {
                key: 'eventVisitor-' + person.id,
                reportId: this.props.params.reportId,
                matchTime: this.state.report.timer.ms,
                person: person,
                team: this.state.report.visitorTeam,
                eventTitle: event.title,
                eventSubtitle: event.subtitle,
                eventType: event.type,
                causeList: event.causes,
                handleEventSubmit: this._handleEventSubmit
              }
            return React.cloneElement(event.component, properties)
          }
        })
      ]
    ]
    return <TabList tabsNames={tabs} tabsItems={items}/>
  }

})

module.exports = PersonList
