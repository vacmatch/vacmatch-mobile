//
// Copyright (c) 2016 by VACmatch
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//

import React from 'react'
import mui from 'material-ui'

import Item from './Item'

let List = mui.List
let Tab = mui.Tab
let Tabs = mui.Tabs

let TabList = React.createClass({

  propTypes: {
    tabsNames: React.PropTypes.array,
    tabsItems: React.PropTypes.array
  },

  createItem: function (index) {
    this.props.tabsItems[index].map(item => {
      return {item}
    })
  },

  render: function () {
    let content = (
      this.props.tabsNames.map((tab, index) => {
        return <Tab key={'tab-' + index} label={tab}>
          <List key={'list-' + index}>
          {
            this.props.tabsItems[index].map((item, itemIndex) => {
              return <Item key={index + '-' + itemIndex} id={index + '-' + itemIndex}>{item}</Item>
            })
          }
          </List>
        </Tab>
      }
    ))

    return (
        <Tabs>{content}</Tabs>
    )
  }
})

module.exports = TabList
