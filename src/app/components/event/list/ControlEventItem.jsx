import React from 'react'
import mui from 'material-ui'

let ListItem = mui.ListItem
let FontIcon = mui.FontIcon
let IconButton = mui.IconButton

let ControlEventItem = React.createClass({

  propTypes: {
    typeIcon: React.PropTypes.string,
    event: React.PropTypes.shape({
      _id: React.PropTypes.string,
      type: React.PropTypes.string,
      title: React.PropTypes.string,
      text: React.PropTypes.string
    }),
    eventType: React.PropTypes.shape({
      title: React.PropTypes.string
    }),
    handleDeleteEvent: React.PropTypes.func
  },

  render: function () {
    return <ListItem
      leftAvatar={
        <FontIcon className={this.props.typeIcon} />
      }
      primaryText={<b>{this.props.eventType.title}
      </b>}
      secondaryText={this.props.event.text}
      rightIcon={
        <IconButton tooltip='Delete' onClick={this.props.handleDeleteEvent.bind(null, this.props.event)}>
          <i className='material-icons'>delete</i>
        </IconButton>
      } />
  }
})

module.exports = ControlEventItem
