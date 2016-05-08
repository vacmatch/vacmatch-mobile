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

import AuthenticatedComponent from '../../generic/AuthenticatedComponent'

let FlatButton = mui.FlatButton
let RaisedButton = mui.RaisedButton

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
    })
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
    // Update report state
    ReportActions.updateReport(this.props.params.reportId, function (report, err) {
      if (err !== null) {
        ErrorActions.setError(err)
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
        SnackBarActions.setElement('Match started')
      }
    })
  },

  _handleFinishedMatch: function () {
    this.history.pushState(null, urls.report.end(this.props.params.reportId))
  },

  render: function () {
    // For start match event creation
    let playButton = <RaisedButton label='Start match' primary={true} onClick={this._handleStartMatch} />

    // Check match state to set button
    switch (this.state.report.report.status) {
      case ReportStatus.READY: {
        playButton = <RaisedButton label='Start match' primary={true} onClick={this._handleStartMatch} />
        break
      }
      case ReportStatus.STARTED: {
        let playButtonLabel = this.state.report.isPlaying ? 'Stop' : 'Play'
        playButton = <FlatButton label={playButtonLabel} primary={true} onClick={ReportActions.updateTime} />
        break
      }
      case ReportStatus.FINISHED: {
        playButton = <RaisedButton label='Match finished' primary={true} onClick={this._handleFinishedMatch} />
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

    return <div>
      <div style={style.center}>
        <Link to={urls.call.list(this.props.params.reportId)}>
          <FlatButton label={this.state.report.report.localTeam.name} secondary={true} />
        </Link>
        <Link to={urls.call.list(this.props.params.reportId)}>
          <FlatButton label={this.state.report.report.visitorTeam.name} secondary={true} />
        </Link>
        <ReportProperty
          value={this.state.report.report.localTeam.result + ' - ' + this.state.report.report.visitorTeam.result}
          isTitle={true} />
      </div>
      <div style={style.container}>
        <ReportProperty name={'Term'} value={this.state.report.term} isPrimary={false} />
        <ReportProperty name={'Fouls'}
          value={this.state.report.report.localTeam.secondaryField + ' - ' + this.state.report.report.visitorTeam.secondaryField}
          isPrimary={false} />
      </div>
      <div style={style.center}>
        <ReportProperty value={this.state.report.time} isPrimary={true} />
        {playButton}
        <EditReport reportId={this.props.params.reportId} cronoUpdate={ReportActions.resetTime} time={this.state.report.time}
           termUpdate={ReportActions.updateTerm} term={this.state.report.term} addMenuElements={this.addRigthMenuElements}/>
         <Link to={urls.event.list(this.props.params.reportId)}>
          <RaisedButton label='Events' secondary={true} style={style.button}/>
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

module.exports = AuthenticatedComponent(Report)
