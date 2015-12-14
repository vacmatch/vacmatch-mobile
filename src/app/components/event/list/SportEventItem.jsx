import React from 'react'
import mui from 'material-ui'

import CronoUtils from '../../../stores/CronoUtils'

let ListItem = mui.ListItem
let FontIcon = mui.FontIcon

let SportEventItem = React.createClass({

  propTypes: {
    typeIcon: React.PropTypes.string,
    event: React.PropTypes.shape({
      type: React.PropTypes.string,
      person: React.PropTypes.shape({
        name: React.PropTypes.string,
        dorsal: React.PropTypes.string
      }),
      team: React.PropTypes.shape({
        name: React.PropTypes.string
      }),
      matchTime: React.PropTypes.number,
      text: React.PropTypes.string
    })
  },

  render: function () {
    return <ListItem
      leftAvatar={
        <FontIcon className={this.props.typeIcon} />
      }
      primaryText={<b>{'(' + this.props.event.person.dorsal + ') ' + this.props.event.person.name}</b>}
      secondaryTextLines={2}
      secondaryText={
        <p>
          {this.props.event.team.name}
        <br/>
          <i>{CronoUtils.milisecondsToString(this.props.event.matchTime) + ' - ' + this.props.event.text}</i>
        </p>
      } />
  }
})

module.exports = SportEventItem
