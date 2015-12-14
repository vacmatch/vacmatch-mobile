import React from 'react'
import Reflux from 'reflux'
import mui from 'material-ui'

import EventActions from '../../../actions/EventActions'
import EventStore from '../../../stores/EventStore'
import SportStore from '../../../stores/SportStore'

import ControlEventItem from './ControlEventItem'
import SportEventItem from './SportEventItem'

let List = mui.List

let PersonList = React.createClass({
  mixins: [
    Reflux.connect(EventStore, 'events'),
    Reflux.connect(SportStore, 'sport')
  ],

  propTypes: {
    params: React.PropTypes.shape({
      reportId: React.PropTypes.string
    })
  },

  componentWillMount: function () {
    EventActions.updateEventList(this.props.params.reportId)
  },

  handleDeleteEvent: function (eventId) {
    EventActions.deleteEvent(eventId, function (event, err) {})
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

module.exports = PersonList
