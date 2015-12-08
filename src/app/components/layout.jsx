import React from 'react'
import Reflux from 'reflux'
import injectTapEventPlugin from 'react-tap-event-plugin'
import mui from 'material-ui'
import { History } from 'react-router'
import MenuStore from '../stores/MenuStore'

// Components
let AppBar = mui.AppBar
let Avatar = mui.Avatar
let LeftNav = mui.LeftNav
let IconMenu = mui.IconMenu
let MenuItem = require('material-ui/lib/menus/menu-item')
let IconButton = mui.IconButton

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://ADFgithub.com/zilverline/react-tap-event-plugin
injectTapEventPlugin()

/*
 * Layout component
 */
let Layout = React.createClass({
  mixins: [
    Reflux.connect(MenuStore, 'menu'),
    History
  ],

  propTypes: {
    children: React.PropTypes.element.isRequired
  },

  _handleTouchTap: function () {
    this.refs.leftNav.toggle()
  },

  _handleClickRightMenu: function (element) {
    // If element has url, go to the link
    if (element.url) {
      this.history.pushState(null, element.url)
    }
    // If element has a callback just use it
    if (element.callback) {
      element.callback()
    }
  },

  render: function () {
    let rightMenuElements = (
      this.state.menu.rightMenu.map((element, index) => {
        return <MenuItem key={index} index={index} primaryText={element.text} onClick={this._handleClickRightMenu.bind(null, element)}/>
      })
    )
    return <div>
      <AppBar
        title='VACmatch'
        onLeftIconButtonTouchTap={this._handleTouchTap}
        iconElementRight={
          <IconMenu
            iconButtonElement={
              <IconButton><i className='material-icons'>more_vert</i></IconButton>
            }>
            {rightMenuElements}
          </IconMenu>
        }
        />
      <LeftNav ref='leftNav' docked={false} menuItems={[]}
        header={
            <Avatar src='assets/img/logos/vacmatch.png' size={100} />
        }/>
      {this.props.children}
      </div>
  }
})

module.exports = Layout
