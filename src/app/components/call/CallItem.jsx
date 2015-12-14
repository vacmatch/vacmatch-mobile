import React from 'react'
import mui from 'material-ui'

import EditPerson from './EditPerson'

// Components
let Avatar = mui.Avatar
let ListItem = mui.ListItem
let Toggle = mui.Toggle
let IconButton = mui.IconButton

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

  getInitialState: function () {
    return {
      dialogIsOpen: false
    }
  },

  toggleDialog: function () {
    this.setState({dialogIsOpen: !this.state.dialogIsOpen})
  },

  render: function () {
    let personName = this.props.person.name
    let personDorsal = this.props.person.dorsal
    let avatarUrl = this.props.person.avatarUrl

    return (
      <div>
        <EditPerson person={this.props.person}
          dialogIsOpen={this.state.dialogIsOpen}
          toggleDialog={this.toggleDialog}/>
        <ListItem key={'listItem-' + this.props.person._id}
          primaryText={personName}
          secondaryText={personDorsal}
          leftAvatar={
            <Avatar src= {avatarUrl} />
          }
          rightToggle={
            <div>
              <Toggle
                name={'toggle-' + this.props.person._id}
                defaultToggled={this.props.person.isCalled}
                onToggle={this.props.handleCallToggle.bind(null, this.props.person._id, this.props.person.teamId)} />
              <IconButton tooltip='Edit' onClick={this.toggleDialog}>
                <i className='material-icons'>settings</i>
              </IconButton>
            </div>
          }/>
      </div>
    )
  }
})

module.exports = Event
