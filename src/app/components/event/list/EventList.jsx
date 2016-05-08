import React from 'react'
import Reflux from 'reflux'
import mui from 'material-ui'

import EventActions from '../../../actions/EventActions'
import EventStore from '../../../stores/EventStore'
import SportStore from '../../../stores/SportStore'
import ReportActions from '../../../actions/ReportActions'
import ErrorActions from '../../../actions/ErrorActions'
import ErrorHandlerStore from '../../../stores/utils/ErrorHandlerStore'
import MenuStore from '../../../stores/MenuStore'
import MenuActions from '../../../actions/MenuActions'
import { History } from 'react-router'
import urls from '../../../api/urls'

import ControlEventItem from './ControlEventItem'
import SportEventItem from './SportEventItem'

import AuthenticatedComponent from '../../generic/AuthenticatedComponent'

let List = mui.List

let PersonList = React.createClass({
  mixins: [
    Reflux.connect(EventStore, 'events'),
    Reflux.connect(SportStore, 'sport'),
    Reflux.connect(MenuStore, 'menu'),
    Reflux.connect(ErrorHandlerStore, 'error'),
    History
  ],

  propTypes: {
    params: React.PropTypes.shape({
      reportId: React.PropTypes.string
    })
  },

  _handleBackEvent: function () {
    this.history.pushState(null, urls.report.show(this.props.params.reportId))
  },

  componentWillMount: function () {
    MenuActions.setLeftMenu('chevron_left', this._handleBackEvent, [])

    // Update report state
    ReportActions.updateReport(this.props.params.reportId, (report, err) => {
      if (err !== null) {
        ErrorActions.setError(err)
      }
    })
    // Update event list
    EventActions.updateEventList(this.props.params.reportId, (events, err) => {
      if (err !== null) {
        ErrorActions.setError(err)
      }
    })
  },

  componentWillUnmount: function () {
    MenuActions.clearRightMenu()
    MenuActions.resetLeftMenu()
  },

  handleDeleteEvent: function (event) {
    // Delete event
    EventActions.deleteEvent(event, (ev, err) => {
      if (err !== null) {
        ErrorActions.setError(err)
      } else {
        // Only if it's a sport event (not a control event)
        if (!this.state.sport.getEventByType(event.type).isControl()) {
          // Update result in report
          ReportActions.updateResultFields(event, this.state.sport, (events, err) => {
            if (err !== null) {
              ErrorActions.setError(err)
            }
          })
        }
      }
    })
  },

  render: function () {
    let items = [
      this.state.events.map(event => {
        let eventType = this.state.sport.getEventByType(event.type)
        // Control events
        if (eventType.isControl()) {
          return <ControlEventItem typeIcon={this.state.sport.getIconByType(event.type)}
            event={event} eventType={eventType} handleDeleteEvent={this.handleDeleteEvent}/>
        // Sport events
        } else {
          return <SportEventItem typeIcon={this.state.sport.getIconByType(event.type)}
            event={event} handleDeleteEvent={this.handleDeleteEvent}/>
        }
      })
    ]
    return <List>
      {items}
    </List>
  }

})

module.exports = AuthenticatedComponent(PersonList)
