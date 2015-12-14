import React from 'react'
import mui from 'material-ui'

let ListItem = mui.ListItem
let FontIcon = mui.FontIcon

let ControlEventItem = React.createClass({

  propTypes: {
    typeIcon: React.PropTypes.string,
    event: React.PropTypes.shape({
      type: React.PropTypes.string,
      title: React.PropTypes.string,
      text: React.PropTypes.string
    }),
    eventType: React.PropTypes.shape({
      title: React.PropTypes.string
    })
  },

  render: function () {
    return <ListItem
      leftAvatar={
        <FontIcon className={this.props.typeIcon} />
      }
      primaryText={<b>{this.props.eventType.title}
      </b>}
      secondaryText={this.props.event.text}
      />
  }
})

module.exports = ControlEventItem
