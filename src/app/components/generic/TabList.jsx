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
            this.props.tabsItems[index].map(item => {
              return <Item key={item.id}>{item}</Item>
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
