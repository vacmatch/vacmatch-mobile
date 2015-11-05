import React from 'react'
import injectTapEventPlugin from 'react-tap-event-plugin'
import mui from 'material-ui'

// Components
let AppBar = mui.AppBar
let Avatar = mui.Avatar
let LeftNav = mui.LeftNav

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://ADFgithub.com/zilverline/react-tap-event-plugin
injectTapEventPlugin()

/*
 * Layout component
 */
let Layout = React.createClass({
  propTypes: {
    children: React.PropTypes.element.isRequired
  },

  _handleTouchTap: function () {
    this.refs.leftNav.toggle()
  },

  render: function () {
    return <div>
      <AppBar
        title='VACmatch'
        iconClassNameRight='muidocs-icon-navigation-expand-more' onLeftIconButtonTouchTap={this._handleTouchTap}/>
      <LeftNav ref='leftNav' docked={false} menuItems={[]}
        header={
            <Avatar src='assets/img/logos/vacmatch.png' size={100} />
        }/>
      {this.props.children}
      </div>
  }
})

module.exports = Layout
