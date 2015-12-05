import React from 'react'
import Reflux from 'reflux'
import mui from 'material-ui'

import EventActions from '../../../actions/EventActions'
import EventStore from '../../../stores/EventStore'
import SportStore from '../../../stores/SportStore'

import CronoUtils from '../../../stores/CronoUtils'

let ListItem = mui.ListItem
let List = mui.List
let FontIcon = mui.FontIcon

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

  render: function () {
    let items = [
      this.state.events.map(event => {
        return <ListItem
          leftAvatar={
            <FontIcon className={this.state.sport.getIconByType(event.type)} />
          }
          primaryText={<b>{'(' + event.person.dorsal + ') ' + event.person.name}</b>}
          secondaryTextLines={2}
          secondaryText={
            <p>
              {event.team.name}
            <br/>
              <i>{CronoUtils.milisecondsToString(event.matchTime) + ' - ' + event.text}</i>
            </p>
          } />
      })
    ]
    return <List>
      {items}
    </List>
  }

})

module.exports = PersonList
