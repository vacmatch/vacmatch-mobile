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
      editDialogIsOpen: false
    }
  },

  toggleEditDialog: function (report) {
    this.setState({editDialogIsOpen: !this.state.editDialogIsOpen})
  },

  componentWillMount: function () {
    // Update team names from this report
    ReportActions.updateReport(this.props.params.reportId, () => {
      // Update players lists (local and visitor)
      ReportActions.updatePlayers(this.props.params.reportId,
        this.state.report.localTeam.id, this.state.report.visitorTeam.id)
    })
  },

  callToggle: function (personId, teamId, toggleEvent, newValue) {
    // Save toggle and update state
    PersonActions.toggleCallPerson(personId, this.props.params.reportId, teamId, newValue)
  },

  handleEdit: function (personId, reportId, teamId) {
    // Update report state
    PersonActions.updatePerson(personId, reportId, teamId, (person, err) => {
      this.toggleEditDialog()
    })
  },

  handleEditConfirm: function (person) {
    // Save new changes in person
    PersonActions.editPerson(person._id, person.name, person.cardId, person.dorsal,
      person.avatarUrl, person.isCalled, person.reportId, person.teamId, person.userId, (updatedPerson, err) => {
        // Update person list
        ReportActions.updatePlayers(this.props.params.reportId,
          this.state.report.localTeam.id, this.state.report.visitorTeam.id, () => {
            this.toggleEditDialog()
          })
      })
  },

  render: function () {
    let tabs =
      [
        this.state.report.localTeam.teamName,
        this.state.report.visitorTeam.teamName
      ]

    let items = [
      [
        this.state.personList.localPeople.map(person => {
          return <CallItem key={'local-' + person.id}
            person={person}
            dialogIsOpen={this.state.editDialogIsOpen}
            toggleDialog={this.handleEdit}
            handleCallToggle={this.callToggle}/>
        })
      ],
      [
        this.state.personList.visitorPeople.map(person => {
          return <CallItem key={'visitor-' + person.id}
            person={person}
            dialogIsOpen={this.state.editDialogIsOpen}
            toggleDialog={this.handleEdit}
            handleCallToggle={this.callToggle}/>
        })
      ]
    ]

    return (
      <div>
        <EditPerson person={this.state.person}
          dialogIsOpen={this.state.editDialogIsOpen}
          toggleDialog={this.toggleEditDialog}
          handleUpdate={this.handleEditConfirm}/>
        <TabList tabsNames={tabs} tabsItems={items}/>
        <FloatingActionButton>
          <i className='material-icons'>add</i>
        </FloatingActionButton>
      </div>
    )
  }

})

module.exports = CallList
