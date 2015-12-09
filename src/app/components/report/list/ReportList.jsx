import React from 'react'
import Reflux from 'reflux'
import mui from 'material-ui'

import ReportItem from './ReportItem'
import ReportListStore from '../../../stores/ReportListStore'
import ReportActions from '../../../actions/ReportActions'
import MenuStore from '../../../stores/MenuStore'
import MenuActions from '../../../actions/MenuActions'

let List = mui.List
let FlatButton = mui.FlatButton
let Tabs = mui.Tabs
let Tab = mui.Tab

let ReportList = React.createClass({
  mixins: [
    Reflux.connect(ReportListStore, 'reportList'),
    Reflux.connect(MenuStore, 'menu')
  ],

  componentWillMount: function () {
    let rightMenuElements = []
    // Set right menu buttons in AppBar
    MenuActions.setRightMenu(rightMenuElements)
    // Update report lists
    ReportActions.updateLists()
  },

  handleAdd: function () {
    let defaultReport = {
      'localTeam': {
        'teamName': 'Carnicería Angel'
      },
      'visitorTeam': {
        'teamName': 'Aspic'
      }
    }
    ReportActions.addReport(defaultReport)
  },

  handleDelete: function (id) {
    ReportActions.deleteReport(id)
  },

  render: function () {
    let nextReportsContent = (
      this.state.reportList.nextReports.map(element => {
        return <div key={element.id} >
          <ReportItem report={element.doc}/>
          <FlatButton label='Delete' onClick={this.handleDelete.bind(this, element.id)}/>
        </div>
      })
    )

    let lastReportsContent = (
      this.state.reportList.lastReports.map(element => {
        return <div key={element.id} >
          <ReportItem report={element.doc}/>
          <FlatButton label='Delete' onClick={this.handleDelete.bind(this, element.id)}/>
        </div>
      })
    )

    return (
      <div>
        <Tabs>
          <Tab label='Next reports'>
            <List>
              {nextReportsContent}
            </List>
          </Tab>
          <Tab label='Last reports'>
            {lastReportsContent}
          </Tab>
        </Tabs>
        <FlatButton label='Add' onClick={this.handleAdd}/>
      </div>
    )
  }
})

module.exports = ReportList
