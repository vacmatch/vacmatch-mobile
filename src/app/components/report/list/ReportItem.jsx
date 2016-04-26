import React from 'react'
import mui from 'material-ui'
import { History } from 'react-router'
import urls from '../../../api/urls'

let ListItem = mui.ListItem
let IconButton = mui.IconButton
let IconMenu = mui.IconMenu
let MenuItem = require('material-ui/lib/menus/menu-item')

let ReportItem = React.createClass({
  mixins: [History],

  propTypes: {
    key: React.PropTypes.number,
    report: React.PropTypes.shape({
      _id: React.PropTypes.string,
      localTeam: React.PropTypes.shape({
        name: React.PropTypes.string,
        result: React.PropTypes.number
      }),
      visitorTeam: React.PropTypes.shape({
        name: React.PropTypes.string,
        result: React.PropTypes.number
      }),
      date: React.PropTypes.string,
      location: React.PropTypes.string,
      status: React.PropTypes.number
    }),
    editDialog: React.PropTypes.func,
    deleteDialog: React.PropTypes.func
  },

  handleClick: function (id) {
    this.history.pushState(null, urls.report.show(id))
  },

  render: function () {
    let menuElements = [
      <MenuItem key={'edit'} index={0} primaryText={'Edit'} onClick={this.props.editDialog.bind(null, this.props.report._id)}/>,
      <MenuItem key={'delete'} index={1} primaryText={'Delete'} onClick={this.props.deleteDialog.bind(null, this.props.report._id)}/>

    ]

    return (
      <div>
        <ListItem key={this.props.key}
          primaryText={this.props.report.localTeam.name + ' ' + this.props.report.localTeam.result +
          ' - ' + this.props.report.visitorTeam.result + ' ' + this.props.report.visitorTeam.name}
          secondaryText={ this.props.report.date + ' - ' + this.props.report.location }
          rightIconButton={
            <IconMenu
              iconButtonElement={
                <IconButton tooltip='Edit'>
                  <i className='material-icons'>more_vert</i>
                </IconButton>
              }>
              {menuElements}
            </IconMenu>
          }
          onTouchTap={(ev) => this.handleClick(this.props.report._id)}
        />
      </div>
    )
  }

})

module.exports = ReportItem
