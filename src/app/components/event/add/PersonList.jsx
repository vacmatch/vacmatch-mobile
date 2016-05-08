import React from 'react'
import Reflux from 'reflux'
import { History } from 'react-router'

import PersonListStore from '../../../stores/PersonListStore'
import ReportStore from '../../../stores/ReportStore'
import ReportActions from '../../../actions/ReportActions'
import EventActions from '../../../actions/EventActions'
import ErrorActions from '../../../actions/ErrorActions'
import ErrorHandlerStore from '../../../stores/utils/ErrorHandlerStore'
import MenuStore from '../../../stores/MenuStore'
import MenuActions from '../../../actions/MenuActions'

import TabList from '../../generic/TabList'
import urls from '../../../api/urls'

import SportStore from '../../../stores/SportStore'

import AuthenticatedComponent from '../../generic/AuthenticatedComponent'

let PersonList = React.createClass({
  mixins: [
    Reflux.connect(PersonListStore, 'personList'),
    Reflux.connect(ReportStore, 'report'),
    Reflux.connect(SportStore, 'sport'),
    Reflux.connect(MenuStore, 'menu'),
    Reflux.connect(ErrorHandlerStore, 'error'),
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
    EventActions.addEvent(reportId, person, team, eventType, matchTime, cause, (event, err) => {
      if (err !== null) {
        ErrorActions.setError(err)
      } else {
        // Update result in report
        ReportActions.updateResultFields(event, this.state.sport, (events, err) => {
          if (err !== null) {
            ErrorActions.setError(err)
          } else {
            // Go to show report view
            this.history.pushState(null, urls.report.show(this.props.params.reportId))
          }
        })
      }
    })
  },

  _handleBackEvent: function () {
    this.history.pushState(null, urls.report.show(this.props.params.reportId))
  },

  componentWillMount: function () {
    MenuActions.setLeftMenu('chevron_left', this._handleBackEvent, [])

    // Update teams from this report
    ReportActions.updateReport(this.props.params.reportId, (report, err) => {
      if (err !== null) {
        ErrorActions.setError(err)
      } else {
        // Update players lists (local and visitor)
        ReportActions.updatePlayers(this.props.params.reportId,
          this.state.report.report.localTeam._id, this.state.report.report.visitorTeam._id, (reportId, err) => {
            if (err !== null) {
              ErrorActions.setError(err)
            }
          })
      }
    })
  },

  componentWillUnmount: function () {
    MenuActions.clearRightMenu()
    MenuActions.resetLeftMenu()
  },

  render: function () {
    let tabs =
      [
        this.state.report.report.localTeam.name,
        this.state.report.report.visitorTeam.name
      ]

    let items = [
      [
        this.state.personList.localPeople.map(person => {
          if (person.isCalled) {
            let event = this.state.sport.getEventByType(this.props.params.eventType)
            let properties =
              {
                key: 'eventLocal-' + person._id,
                reportId: this.props.params.reportId,
                matchTime: this.state.report.timer.ms,
                person: person,
                team: this.state.report.report.localTeam,
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
                key: 'eventVisitor-' + person._id,
                reportId: this.props.params.reportId,
                matchTime: this.state.report.timer.ms,
                person: person,
                team: this.state.report.report.visitorTeam,
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

module.exports = AuthenticatedComponent(PersonList)
