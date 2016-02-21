import React from 'react'
import Reflux from 'reflux'
import mui from 'material-ui'

import ReportItem from './ReportItem'
import ReportListStore from '../../../stores/ReportListStore'
import ReportActions from '../../../actions/ReportActions'
import ReportStore from '../../../stores/ReportStore'
import MenuStore from '../../../stores/MenuStore'
import MenuActions from '../../../actions/MenuActions'
import AuthStore from '../../../stores/AuthStore'
import RefereeActions from '../../../actions/RefereeActions'
import RefereeStore from '../../../stores/RefereeStore'

import TabList from '../../generic/TabList'
import EditReport from '../add/EditReport'

import AuthenticatedComponent from '../../generic/AuthenticatedComponent'

let FloatingActionButton = mui.FloatingActionButton

let ReportList = React.createClass({
  mixins: [
    Reflux.connect(ReportListStore, 'reportList'),
    Reflux.connect(ReportStore, 'report'),
    Reflux.connect(MenuStore, 'menu'),
    Reflux.connect(RefereeStore, 'referee'),
    Reflux.connect(AuthStore, 'auth')
  ],

  getInitialState: function () {
    return {
      editDialogIsOpen: false,
      createDialogIsOpen: false
    }
  },

  toggleEditDialog: function () {
    this.setState({editDialogIsOpen: !this.state.editDialogIsOpen})
  },

  toggleCreateDialog: function () {
    this.setState({createDialogIsOpen: !this.state.createDialogIsOpen})
  },

  componentWillMount: function () {
    let rightMenuElements = []
    // Set right menu buttons in AppBar
    MenuActions.setRightMenu(rightMenuElements)
    // Update report lists
    ReportActions.updateLists()
  },

  handleCreate: function () {
    this.toggleCreateDialog()
  },

  handleCreateConfirm: function (newReport) {
    let userId = ''
    if (this.state.auth.user !== null) {
      userId = this.state.auth.user._id
    }
    // TODO: Add more referees
    // Find Referee from logged User
    RefereeActions.findByUserId(userId, (referee, err) => {
      if (err === null) {
        let refereeList = [referee]
        // Save new changes in report
        ReportActions.addReport(newReport.date, newReport.location,
          newReport.localTeam, newReport.visitorTeam, refereeList, (result, err) => {
            if (err === null) {
              // Update report list
              ReportActions.updateLists(() => {
                this.toggleCreateDialog()
              })
            }
          })
      }
    })
  },

  handleEdit: function (reportId) {
    // Update report state
    ReportActions.updateReport(reportId, () => {
      this.toggleEditDialog()
    })
  },

  handleEditConfirm: function (report) {
    // Save new changes in report
    ReportActions.editReport(report._id, report.date, report.location, report.hasFinished,
      report.localTeam, report.visitorTeam, report.incidences, (result, err) => {
        // Update report list
        ReportActions.updateLists(() => {
          this.toggleEditDialog()
        })
      })
  },

  handleDeleteConfirm: function (id) {
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
          return <ReportItem key={'next-' + element._id}
            report={element}
            editDialog={this.handleEdit}
            deleteDialog={this.handleDeleteConfirm}/>
        })
      ],
      [
        this.state.reportList.lastReports.map(element => {
          return <ReportItem key={'last-' + element._id}
            report={element}
            editDialog={this.handleEdit}
            deleteDialog={this.handleDeleteConfirm}/>
        })
      ]
    ]

    // Empty report to host a new report
    let emptyReport = {
      date: '',
      location: '',
      hasFinished: false,
      localTeam: {
        _id: null,
        teamName: '',
        result: 0,
        secondaryField: 0
      },
      visitorTeam: {
        _id: null,
        teamName: '',
        result: 0,
        secondaryField: 0
      },
      incidences: '',
      refereeList: []
    }

    return (
      <div>
        <TabList tabsNames={tabs} tabsItems={items}/>
        <FloatingActionButton onClick={this.handleCreate}>
          <i className='material-icons'>add</i>
        </FloatingActionButton>
        <EditReport
          report={this.state.report}
          title='Edit report'
          dialogIsOpen={this.state.editDialogIsOpen}
          toggleDialog={this.toggleEditDialog}
          handleUpdate={this.handleEditConfirm} />
        <EditReport
          report={emptyReport}
          title='Create report'
          dialogIsOpen={this.state.createDialogIsOpen}
          toggleDialog={this.toggleCreateDialog}
          handleUpdate={this.handleCreateConfirm} />
      </div>
    )
  }
})

module.exports = AuthenticatedComponent(ReportList)
