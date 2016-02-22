import React from 'react'
import Reflux from 'reflux'
import mui from 'material-ui'

import PersonListStore from '../../stores/PersonListStore'
import ReportActions from '../../actions/ReportActions'
import PersonStore from '../../stores/PersonStore'
import ReportStore from '../../stores/ReportStore'
import PersonActions from '../../actions/PersonActions'

import TabList from '../generic/TabList'
import CallItem from './CallItem'
import EditPerson from './EditPerson'
import Person from '../../models/person/Person'

import AuthenticatedComponent from '../generic/AuthenticatedComponent'

let FloatingActionButton = mui.FloatingActionButton

let CallList = React.createClass({
  mixins: [
    Reflux.connect(PersonListStore, 'personList'),
    Reflux.connect(PersonStore, 'person'),
    Reflux.connect(ReportStore, 'report')
  ],

  propTypes: {
    params: React.PropTypes.shape({
      reportId: React.PropTypes.string
    })
  },

  getInitialState: function () {
    return {
      editDialogIsOpen: false,
      createDialogIsOpen: false
    }
  },

  toggleEditDialog: function (report) {
    this.setState({editDialogIsOpen: !this.state.editDialogIsOpen})
  },

  toggleCreateDialog: function (report) {
    this.setState({createDialogIsOpen: !this.state.createDialogIsOpen})
  },

  componentWillMount: function () {
    // Update team names from this report
    ReportActions.updateReport(this.props.params.reportId, () => {
      // Update players lists (local and visitor)
      ReportActions.updatePlayers(this.props.params.reportId,
        this.state.report.report.localTeam._id, this.state.report.report.visitorTeam._id)
    })
  },

  callToggle: function (personId, teamId, toggleEvent, newValue) {
    // Save toggle and update state
    PersonActions.toggleCallPerson(personId, this.props.params.reportId, teamId, newValue)
  },

  handleCreate: function (personId, reportId, teamId) {
    this.toggleCreateDialog()
  },

  handleCreateConfirm: function (oldTeamId, person) {
    // Add person and update it in state
    PersonActions.addPerson(person.name, person.cardId, person.dorsal, person.avatarUrl,
      person.isCalled, person.isStaff, person.reportId, person.teamId, person.userId, (data, err) => {
        // Update person list
        ReportActions.updatePlayers(this.props.params.reportId,
          this.state.report.report.localTeam._id, this.state.report.report.visitorTeam._id, () => {
            this.toggleCreateDialog()
          })
      })
  },

  handleEdit: function (personId, reportId, teamId) {
    // Update report state
    PersonActions.updatePerson(personId, reportId, teamId, (person, err) => {
      this.toggleEditDialog()
    })
  },

  handleEditConfirm: function (oldTeamId, person) {
    // Save new changes in person
    PersonActions.editPerson(person._id, person.name, person.cardId, person.dorsal,
      person.avatarUrl, person.isCalled, person.isStaff, person.reportId, oldTeamId, person.teamId, person.userId, (updatedPerson, err) => {
        // Update person list
        ReportActions.updatePlayers(this.props.params.reportId,
          this.state.report.report.localTeam._id, this.state.report.report.visitorTeam._id, () => {
            this.toggleEditDialog()
          })
      })
  },

  handleDelete: function (personId, reportId, teamId) {
    PersonActions.deletePerson(personId, reportId, teamId)
  },

  render: function () {
    let tabs =
      [
        this.state.report.report.localTeam.teamName,
        this.state.report.report.visitorTeam.teamName
      ]

    let items = [
      [
        this.state.personList.localPeople.map(person => {
          return <CallItem key={'local-' + person._id}
            person={person}
            dialogIsOpen={this.state.editDialogIsOpen}
            editDialog={this.handleEdit}
            deleteDialog={this.handleDelete}
            handleCallToggle={this.callToggle}/>
        })
      ],
      [
        this.state.personList.visitorPeople.map(person => {
          return <CallItem key={'visitor-' + person._id}
            person={person}
            dialogIsOpen={this.state.editDialogIsOpen}
            editDialog={this.handleEdit}
            deleteDialog={this.handleDelete}
            handleCallToggle={this.callToggle}/>
        })
      ]
    ]

    let emptyPerson = new Person(undefined, '', '', '', '', false, false, this.state.report.report._id, this.state.report.report.localTeam._id, '')

    let teams =
      [
        {payload: 1, text: this.state.report.report.localTeam.teamName, value: this.state.report.report.localTeam._id},
        {payload: 2, text: this.state.report.report.visitorTeam.teamName, value: this.state.report.report.visitorTeam._id}
      ]

    return (
      <div>
        <EditPerson person={this.state.person}
          title='Edit person'
          dialogIsOpen={this.state.editDialogIsOpen}
          toggleDialog={this.toggleEditDialog}
          handleUpdate={this.handleEditConfirm}
          teams={teams}/>
        <EditPerson person={emptyPerson}
          title='Create person'
          dialogIsOpen={this.state.createDialogIsOpen}
          toggleDialog={this.toggleCreateDialog}
          handleUpdate={this.handleCreateConfirm}
          teams={teams}/>
        <TabList tabsNames={tabs} tabsItems={items}/>
        <FloatingActionButton onClick={this.handleCreate}>
          <i className='material-icons'>add</i>
        </FloatingActionButton>
      </div>
    )
  }

})

module.exports = AuthenticatedComponent(CallList)
