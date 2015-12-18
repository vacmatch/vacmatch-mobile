import React from 'react'
import Reflux from 'reflux'
import mui from 'material-ui'

import ReportItem from './ReportItem'
import ReportListStore from '../../../stores/ReportListStore'
import ReportActions from '../../../actions/ReportActions'
import ReportStore from '../../../stores/ReportStore'
import MenuStore from '../../../stores/MenuStore'
import MenuActions from '../../../actions/MenuActions'
import PersonActions from '../../../actions/PersonActions'
import PersonStore from '../../../stores/PersonStore'

import TabList from '../../generic/TabList'
import EditReport from '../add/EditReport'

let FloatingActionButton = mui.FloatingActionButton

let ReportList = React.createClass({
  mixins: [
    Reflux.connect(ReportListStore, 'reportList'),
    Reflux.connect(PersonStore, 'person'),
    Reflux.connect(ReportStore, 'report'),
    Reflux.connect(MenuStore, 'menu')
  ],

  getInitialState: function () {
    return {
      dialogIsOpen: false
    }
  },

  toggleDialog: function () {
    this.setState({dialogIsOpen: !this.state.dialogIsOpen})
  },

  componentWillMount: function () {
    let rightMenuElements = []
    // Set right menu buttons in AppBar
    MenuActions.setRightMenu(rightMenuElements)
    // Update report lists
    ReportActions.updateLists()
  },

  handleAdd: function () {
    let defaultReport = {
      date: '',
      location: '',
      localTeam: {
        id: 1,
        teamName: 'Carnicería Angel',
        result: 0,
        secondaryField: 0
      },
      visitorTeam: {
        id: 2,
        teamName: 'Aspic',
        result: 0,
        secondaryField: 0
      }
    }
    ReportActions.addReport(defaultReport.date, defaultReport.location,
      defaultReport.localTeam, defaultReport.visitorTeam, (report) => {
        let defaultPerson = {
          name: 'Fulano local',
          cardId: '33445566Z',
          dorsal: '1',
          avatarUrl: 'http://lorempixel.com/100/100/sports/',
          isCalled: false,
          reportId: report.id,
          teamId: 1,
          userId: 1
        }
        PersonActions.addPerson(defaultPerson.name, defaultPerson.cardId, defaultPerson.dorsal,
          defaultPerson.avatarUrl, defaultPerson.isCalled, defaultPerson.reportId,
          defaultPerson.teamId, defaultPerson.userId, (person, err) => {})
      })
  },

  handleEdit: function (reportId) {
    // Update report state
    ReportActions.updateReport(reportId, () => {
      this.toggleDialog()
    })
  },

  handleUpdate: function (report) {
    // Save new changes in report
    ReportActions.editReport(report.id, report.date, report.location,
      report.localTeam, report.visitorTeam, (result, err) => {
        // Update report list
        ReportActions.updateLists(() => {
          this.toggleDialog()
        })
      })
  },

  handleDelete: function (id) {
    ReportActions.deleteReport(id)
  },

  render: function () {
    let tabs =
      [
        'Next reports',
        'Last reports'
      ]

    let items = [
      [
        this.state.reportList.nextReports.map(element => {
          return <ReportItem key={'next-' + element.id}
            report={element.doc}
            editDialog={this.handleEdit}
            deleteDialog={this.handleDelete}/>
        })
      ],
      [
        this.state.reportList.lastReports.map(element => {
          return <ReportItem key={'last-' + element.id}
            report={element.doc}
            editDialog={this.handleEdit}
            deleteDialog={this.handleDelete}/>
        })
      ]
    ]
    return (
      <div>
        <TabList tabsNames={tabs} tabsItems={items}/>
        <FloatingActionButton onClick={this.handleAdd}>
          <i className='material-icons'>add</i>
        </FloatingActionButton>
        <EditReport
          report={this.state.report}
          dialogIsOpen={this.state.dialogIsOpen}
          toggleDialog={this.toggleDialog}
          handleUpdate={this.handleUpdate} />
      </div>
    )
  }
})

module.exports = ReportList
