import React from 'react'
import Reflux from 'reflux'
import mui from 'material-ui'

import ReportItem from './ReportItem'
import ReportListStore from '../../stores/ReportListStore'
import ReportActions from '../../actions/ReportActions'

let List = mui.List
let FlatButton = mui.FlatButton

let ReportList = React.createClass({
  mixins: [Reflux.connect(ReportListStore, 'reportList')],

  componentWillMount: function () {
    ReportActions.updateList()
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
    let content = (
      this.state.reportList.map(element => {
        return <div key={element.id} >
          <ReportItem report={element.doc}/>
          <FlatButton label='Delete' onClick={this.handleDelete.bind(this, element.id)}/>
        </div>
      })
    )

    return (
      <div>
        <List>
          {content}
        </List>
        <FlatButton label='Add' onClick={this.handleAdd}/>
      </div>
    )
  }
})

module.exports = ReportList
