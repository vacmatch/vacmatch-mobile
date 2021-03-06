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
import Reflux from 'reflux'
import mui from 'material-ui'

import PersonListStore from '../../stores/PersonListStore'
import ReportActions from '../../actions/ReportActions'
import PersonStore from '../../stores/PersonStore'
import ReportStore from '../../stores/ReportStore'
import PersonActions from '../../actions/PersonActions'
import ErrorActions from '../../actions/ErrorActions'
import ErrorHandlerStore from '../../stores/utils/ErrorHandlerStore'
import MenuStore from '../../stores/MenuStore'
import MenuActions from '../../actions/MenuActions'
import { History } from 'react-router'

import TabList from '../generic/TabList'
import CallItem from './CallItem'
import EditPerson from './EditPerson'
import Person from '../../models/person/Person'
import {defineMessages, intlShape, injectIntl} from 'react-intl'

import AuthenticatedComponent from '../generic/AuthenticatedComponent'
import urls from '../../api/urls'
import LeftMenuData from '../../stores/utils/LeftMenuData'

let FloatingActionButton = mui.FloatingActionButton

import style from '../../../assets/style/generic-style'

const messages = defineMessages({
  editPersonTitle: {
    id: 'call.editPerson',
    description: 'Edit person title for edit person dialog',
    defaultMessage: 'Edit person'
  },
  createPersonTitle: {
    id: 'call.createPerson',
    description: 'Create person title for edit person dialog',
    defaultMessage: 'Create person'
  }
})

let CallList = React.createClass({
  mixins: [
    Reflux.connect(PersonListStore, 'personList'),
    Reflux.connect(PersonStore, 'person'),
    Reflux.connect(ReportStore, 'report'),
    Reflux.connect(MenuStore, 'menu'),
    Reflux.connect(ErrorHandlerStore, 'error'),
    History
  ],

  propTypes: {
    params: React.PropTypes.shape({
      reportId: React.PropTypes.string
    }),
    intl: intlShape.isRequired
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

  _handleBackEvent: function () {
    this.history.pushState(null, urls.report.show(this.props.params.reportId))
  },

  componentWillMount: function () {
    let menuItems = []
    let backActionName = LeftMenuData.getBackActionName()
    let icon = LeftMenuData.getBackIcon()
    // Add menu default action
    MenuActions.addActionFunction(backActionName, this._handleBackEvent, () => {
      // Set left menu buttons
      MenuActions.setLeftMenu(icon, backActionName, menuItems)
    })

    // Update team names from this report
    ReportActions.updateReport(this.props.params.reportId, (report, err) => {
      if (err !== null) {
        ErrorActions.setError(err)
      } else {
        // Update players lists (local and visitor)
        ReportActions.updatePlayers(this.props.params.reportId,
          this.state.report.report.localTeam._id, this.state.report.report.visitorTeam._id, (reportId, err) => {
            if (err !== null) {
              ErrorActions.setError(err)
            }
          })
      }
    })
  },

  componentWillUnmount: function () {
    MenuActions.clearRightMenu()
  },

  callToggle: function (personId, teamId, toggleEvent, newValue) {
    // Save toggle and update state
    PersonActions.toggleCallPerson(personId, this.props.params.reportId, teamId, newValue, (person, err) => {
      if (err !== null) {
        ErrorActions.setError(err)
      }
    })
  },

  handleCreate: function (personId, reportId, teamId) {
    this.toggleCreateDialog()
  },

  handleCreateConfirm: function (oldTeamId, person) {
    // Add person and update it in state
    PersonActions.addPerson(person.name, person.cardId, person.dorsal, person.avatarUrl,
      person.isCalled, person.isStaff, person.reportId, person.teamId, person.userId, (p, err) => {
        if (err !== null) {
          ErrorActions.setError(err)
        } else {
          // Update person list
          ReportActions.updatePlayers(this.props.params.reportId,
            this.state.report.report.localTeam._id, this.state.report.report.visitorTeam._id, (reportId, err) => {
              if (err !== null) {
                ErrorActions.setError(err)
              } else {
                this.toggleCreateDialog()
              }
            })
        }
      })
  },

  handleEdit: function (personId, reportId, teamId) {
    // Update report state
    PersonActions.updatePerson(personId, reportId, teamId, (person, err) => {
      if (err !== null) {
        ErrorActions.setError(err)
      } else {
        this.toggleEditDialog()
      }
    })
  },

  handleEditConfirm: function (oldTeamId, person) {
    // Save new changes in person
    PersonActions.editPerson(person._id, person.name, person.cardId, person.dorsal,
      person.avatarUrl, person.isCalled, person.isStaff, person.reportId, oldTeamId, person.teamId, person.userId, (updatedPerson, err) => {
        if (err !== null) {
          ErrorActions.setError(err)
        } else {
          // Update person list
          ReportActions.updatePlayers(this.props.params.reportId,
            this.state.report.report.localTeam._id, this.state.report.report.visitorTeam._id, (reportId, err) => {
              if (err !== null) {
                ErrorActions.setError(err)
              } else {
                this.toggleEditDialog()
              }
            })
        }
      })
  },

  handleDelete: function (personId, reportId, teamId) {
    PersonActions.deletePerson(personId, reportId, teamId, (person, err) => {
      if (err !== null) {
        ErrorActions.setError(err)
      }
    })
  },

  render: function () {
    let tabs =
      [
        this.state.report.report.localTeam.name,
        this.state.report.report.visitorTeam.name
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

    let emptyPerson = new Person(undefined, '', '', '', '', false, false, this.state.report.report._id, this.state.report.report.localTeam._id, null)

    let teams =
      [
        {payload: 1, text: this.state.report.report.localTeam.name, value: this.state.report.report.localTeam._id},
        {payload: 2, text: this.state.report.report.visitorTeam.name, value: this.state.report.report.visitorTeam._id}
      ]

    let editTitle = this.props.intl.formatMessage(messages.editPersonTitle)
    let createTitle = this.props.intl.formatMessage(messages.createPersonTitle)
    return (
      <div>
        <EditPerson person={this.state.person}
          title={editTitle}
          dialogIsOpen={this.state.editDialogIsOpen}
          toggleDialog={this.toggleEditDialog}
          handleUpdate={this.handleEditConfirm}
          teams={teams}/>
        <EditPerson person={emptyPerson}
          title={createTitle}
          dialogIsOpen={this.state.createDialogIsOpen}
          toggleDialog={this.toggleCreateDialog}
          handleUpdate={this.handleCreateConfirm}
          teams={teams}/>
        <TabList tabsNames={tabs} tabsItems={items}/>
        <FloatingActionButton style={style.addButton} onClick={this.handleCreate}>
          <i className='material-icons'>add</i>
        </FloatingActionButton>
      </div>
    )
  }

})

module.exports = AuthenticatedComponent(injectIntl(CallList))
