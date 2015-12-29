import React from 'react'
import mui from 'material-ui'

// Components
let Avatar = mui.Avatar
let ListItem = mui.ListItem
let Toggle = mui.Toggle
let IconButton = mui.IconButton
import style from '../../../assets/style/generic-style'

let Event = React.createClass({

  propTypes: {
    dialogIsOpen: React.PropTypes.bool,
    toggleDialog: React.PropTypes.func,
    handleCallToggle: React.PropTypes.func,
    person: React.PropTypes.shape({
      _id: React.PropTypes.string,
      name: React.PropTypes.string,
      dorsal: React.PropTypes.string,
      avatarUrl: React.PropTypes.string,
      isCalled: React.PropTypes.boolean,
      isStaff: React.PropTypes.boolean,
      reportId: React.PropTypes.string,
      teamId: React.PropTypes.string,
      userId: React.PropTypes.string
    })
  },

  render: function () {
    let personName = this.props.person.name
    let staffLabel = <span style={style.secondaryColor}>Player</span>
    if (this.props.person.isStaff) {
      staffLabel = <span style={style.primaryColor}>Staff</span>
    }
    let personDorsal = (
      <div>
        <span>{this.props.person.dorsal}</span>
        <br/>
        <small>{staffLabel}</small>
      </div>
    )
    let avatarUrl = this.props.person.avatarUrl

    return (
      <div>
        <ListItem key={'listItem-' + this.props.person._id}
          primaryText={personName}
          secondaryTextLines={2}
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
              <IconButton tooltip='Edit'
                onClick={this.props.toggleDialog.bind(null, this.props.person._id, this.props.person.reportId, this.props.person.teamId)}>
                <i className='material-icons'>settings</i>
              </IconButton>
            </div>
          }/>
      </div>
    )
  }
})

module.exports = Event
