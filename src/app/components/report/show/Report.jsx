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
import { Link } from 'react-router'

import style from './report-style'
import ReportProperty from './ReportProperty'
import EditReport from './EditReport'
import ReportStore from '../../../stores/ReportStore'
import ReportActions from '../../../actions/ReportActions'
import EventActions from '../../../actions/EventActions'
import urls from '../../../api/urls'
import SportStore from '../../../stores/SportStore'
import StartMatchEvent from '../../../models/web/event/control/StartMatchEvent'
import MenuStore from '../../../stores/MenuStore'
import MenuActions from '../../../actions/MenuActions'
import EndMatchDialog from './EndMatchDialog'
import ErrorActions from '../../../actions/ErrorActions'
import ErrorHandlerStore from '../../../stores/utils/ErrorHandlerStore'
import SnackBarActions from '../../../actions/SnackBarActions'
import SnackBarStore from '../../../stores/SnackBarStore'
import ReportStatus from '../../../models/report/ReportStatus'
import { History } from 'react-router'
import {FormattedMessage, injectIntl, intlShape, defineMessages} from 'react-intl'
import LeftMenuData from '../../../stores/utils/LeftMenuData'

import AuthenticatedComponent from '../../generic/AuthenticatedComponent'

let FlatButton = mui.FlatButton
let RaisedButton = mui.RaisedButton

const messages = defineMessages({
  matchStarted: {
    id: 'report.show.snackbar.matchStarted',
    description: 'Match started message for snack bar',
    defaultMessage: 'Match started'
  },
  termLabel: {
    id: 'report.show.term',
    description: 'Term label',
    defaultMessage: 'Term'
  },
  foulsLabel: {
    id: 'report.show.fouls',
    description: 'Fouls label',
    defaultMessage: 'Fouls'
  }
})

let Report = React.createClass({
  mixins: [
    Reflux.connect(ReportStore, 'report'),
    Reflux.connect(SportStore, 'sport'),
    Reflux.connect(MenuStore, 'menu'),
    Reflux.connect(ErrorHandlerStore, 'error'),
    Reflux.connect(SnackBarStore, 'snack'),
    History
  ],

  propTypes: {
    params: React.PropTypes.shape({
      reportId: React.PropTypes.string
    }),
    intl: intlShape.isRequired
  },

  // Add elements to the rigth menu in the AppBar
  addRigthMenuElements: function (elements) {
    let rightMenuElements = []
    elements.map(e => rightMenuElements.push(e))
    // Set right menu buttons in AppBar
    MenuActions.setRightMenu(rightMenuElements)
  },

  componentWillMount: function () {
    let rightMenuElements = []
    // Set right menu buttons in AppBar
    this.addRigthMenuElements(rightMenuElements)
    // Set left menu buttons
    let menuItems = LeftMenuData.loggedLeftMenuItems()
    let toggleActionName = LeftMenuData.getToggleActionName()
    let icon = LeftMenuData.getMenuIcon()
    MenuActions.setLeftMenu(icon, toggleActionName, menuItems)
    // Update report state
    ReportActions.updateReport(this.props.params.reportId, (report, err) => {
      if (err !== null) {
        ErrorActions.setError(err)
        if (err.name === 'InstanceNotFoundException') {
          this.history.pushState(null, urls.report.list)
        }
      }
    })
  },

  componentWillUnmount: function () {
    MenuActions.clearRightMenu()
  },

  _handleStartMatch: function () {
    // Create start match control event
    let event = new StartMatchEvent()
    EventActions.addControlEvent(this.props.params.reportId, event.type, this.state.report.timer.ms, '', (event, err) => {
      if (err !== null) {
        ErrorActions.setError(err)
      } else {
        // Set match has started in state
        ReportActions.toggleStartMatch()
        SnackBarActions.setElement(this.props.intl.formatMessage(messages.matchStarted))
      }
    })
  },

  _handleFinishedMatch: function () {
    this.history.pushState(null, urls.report.end(this.props.params.reportId))
  },

  render: function () {
    // For start match event creation
    let playButton = <RaisedButton label={
      <FormattedMessage
          id='report.show.startMatch'
          description='Start match button title'
          defaultMessage='Start match'
      />
    } primary={true} onClick={this._handleStartMatch} />

    // Check match state to set button
    switch (this.state.report.report.status) {
      case ReportStatus.READY: {
        playButton = <RaisedButton label={
          <FormattedMessage
              id='report.show.startMatch'
          />
        } primary={true} onClick={this._handleStartMatch} />
        break
      }
      case ReportStatus.STARTED: {
        let playButtonLabel = (
          this.state.report.isPlaying ? <FormattedMessage
              id='report.show.stop'
              description='Stop button for match time'
              defaultMessage='Stop'/>
          : <FormattedMessage
              id='report.show.play'
              description='Start button for match time'
              defaultMessage='Play'/>
        )
        playButton = <FlatButton label={playButtonLabel} primary={true} onClick={ReportActions.updateTime} />
        break
      }
      case ReportStatus.FINISHED: {
        playButton = <RaisedButton label={
          <FormattedMessage
             id='report.show.matchFinished'
             description='Match finisehd button'
             defaultMessage='Match finisehd'
         />
        } primary={true} onClick={this._handleFinishedMatch} />
        break
      }
      default:

    }

    // Create Sport Events, only 2 for each row
    let events = (
      this.state.sport.getEvents().map((e, index) => {
        if (index % 2) {
          return <Link key={index} to={urls.event.add(this.props.params.reportId, e.type)}>
              <RaisedButton label={e.title} primary={true} style={style.button}/>
              <br/><br/>
            </Link>
        } else {
          return <Link key={index} to={urls.event.add(this.props.params.reportId, e.type)}>
              <RaisedButton label={e.title} primary={true} style={style.button}/>
            </Link>
        }
      })
    )

    let termLabel = this.props.intl.formatMessage(messages.termLabel)
    let foulsLabel = this.props.intl.formatMessage(messages.foulsLabel)

    return <div style={style.content}>
      <div style={style.center}>
        <Link to={urls.call.list(this.props.params.reportId)}>
          <FlatButton label={this.state.report.report.localTeam.name} secondary={true}/>
        </Link>
        <Link to={urls.call.list(this.props.params.reportId)}>
          <FlatButton label={this.state.report.report.visitorTeam.name} secondary={true} />
        </Link>
        <ReportProperty
          value={this.state.report.report.localTeam.result + ' - ' + this.state.report.report.visitorTeam.result}
          isTitle={true} />
      </div>
      <div style={style.container}>
        <ReportProperty name={termLabel} value={this.state.report.term} isPrimary={false} />
        <ReportProperty name={foulsLabel}
          value={this.state.report.report.localTeam.secondaryField + ' - ' + this.state.report.report.visitorTeam.secondaryField}
          isPrimary={false} />
      </div>
      <div style={style.center}>
        <ReportProperty value={this.state.report.time} isPrimary={true} />
        {playButton}
        <EditReport reportId={this.props.params.reportId} cronoUpdate={ReportActions.resetTime} time={this.state.report.time}
           termUpdate={ReportActions.updateTerm} term={this.state.report.term} addMenuElements={this.addRigthMenuElements}/>
         <Link to={urls.event.list(this.props.params.reportId)}>
          <RaisedButton label={
            <FormattedMessage
               id='report.show.events'
               description='Events button'
               defaultMessage='Events'
           />
          } secondary={true} style={style.button}/>
        </Link>
      </div>
      <hr/>
      <div style={style.center}>
        <div style={style.buttonRow}>
          {events}
        </div>
      </div>
      <EndMatchDialog reportId={this.props.params.reportId}
        matchTime={this.state.report.timer.ms} addMenuElements={this.addRigthMenuElements}/>
    </div>
  }

})

module.exports = AuthenticatedComponent(injectIntl(Report))
