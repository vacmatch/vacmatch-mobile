import React from 'react'
import mui from 'material-ui'
import { History } from 'react-router'
import urls from '../../../api/urls'

let ListItem = mui.ListItem
let Avatar = mui.Avatar

let ReportItem = React.createClass({
  mixins: [History],

  propTypes: {
    key: React.PropTypes.number,
    report: React.PropTypes.object
  },

  handleClick: function (id) {
    this.history.pushState(null, urls.report.show(id))
  },

  render: function () {
    return (
        <ListItem
          key={this.props.key}
          primaryText={this.props.report.localTeam.teamName + ' - ' + this.props.report.visitorTeam.teamName}
          secondaryText={ this.props.report.date + ' - ' + this.props.report.place }
          leftAvatar={<Avatar src= { this.props.report.localAvatarUrl } />}
          rightAvatar={<Avatar src={ this.props.report.localAvatarUrl } />}
          onClick={(ev) => this.handleClick(this.props.report._id)}
        />
    )
  }
})

module.exports = ReportItem
