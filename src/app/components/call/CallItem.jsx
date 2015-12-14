import React from 'react'
import mui from 'material-ui'

// Components
let Avatar = mui.Avatar
let ListItem = mui.ListItem
let Toggle = mui.Toggle

let Event = React.createClass({

  propTypes: {
    handleCallToggle: React.PropTypes.func,
    person: React.PropTypes.shape({
      _id: React.PropTypes.string,
      name: React.PropTypes.string,
      dorsal: React.PropTypes.string,
      avatarUrl: React.PropTypes.string,
      isCalled: React.PropTypes.boolean,
      teamId: React.PropTypes.number
    })
  },

  render: function () {
    let personName = this.props.person.name
    let personDorsal = this.props.person.dorsal
    let avatarUrl = this.props.person.avatarUrl

    return (
      <ListItem key={'listItem-' + this.props.person._id}
        primaryText={personName}
        secondaryText={personDorsal}
        leftAvatar={<Avatar src= {avatarUrl} />}
        rightToggle={
          <Toggle
            name={'toggle-' + this.props.person._id}
            defaultToggled={this.props.person.isCalled}
            onToggle={this.props.handleCallToggle.bind(null, this.props.person._id, this.props.person.teamId)} />
        } />
    )
  }
})

module.exports = Event
