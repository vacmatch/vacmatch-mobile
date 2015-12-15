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
import StartMatchEvent from '../../../models/event/control/StartMatchEvent'
import MenuStore from '../../../stores/MenuStore'
import MenuActions from '../../../actions/MenuActions'
import EndMatchDialog from './EndMatchDialog'

let FlatButton = mui.FlatButton
let RaisedButton = mui.RaisedButton
let Snackbar = mui.Snackbar

let Report = React.createClass({
  mixins: [
    Reflux.connect(ReportStore, 'report'),
    Reflux.connect(SportStore, 'sport'),
    Reflux.connect(MenuStore, 'menu')
  ],

  propTypes: {
    params: React.PropTypes.shape({
      id: React.PropTypes.string
    })
  },

  getInitialState: function () {
    return {
      snackbarMessage: ''
    }
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
    ReportActions.updateReport(this.props.params.id, function () {})
  },

  _handleStartMatch: function () {
    // Create start match control event
    let event = new StartMatchEvent()
    EventActions.addControlEvent(this.props.params.id, event.type, this.state.report.timer.ms, '', () => {
      // Set match has started in state
      ReportActions.toggleStartMatch()
      this.setState({snackbarMessage: 'Match started'})
      this.refs.snack.show()
    })
  },

  render: function () {
    // For start match event creation
    let playButton = <RaisedButton label='Start match' primary={true} onClick={this._handleStartMatch} />
    // If Match has started
    if (this.state.report.hasStarted) {
      let playButtonLabel = 'Play'
      if (this.state.report.isPlaying) {
        playButtonLabel = 'Stop'
      }
      playButton = <FlatButton label={playButtonLabel} primary={true} onClick={ReportActions.updateTime} />
    }

    // Create Sport Events, only 2 for each row
    let events = (
      this.state.sport.getEvents().map((e, index) => {
        if (index % 2) {
          return <Link key={index} to={urls.event.add(this.props.params.id, e.type)}>
              <RaisedButton label={e.title} primary={true} style={style.button}/>
              <br/><br/>
            </Link>
        } else {
          return <Link key={index} to={urls.event.add(this.props.params.id, e.type)}>
              <RaisedButton label={e.title} primary={true} style={style.button}/>
            </Link>
        }
      })
    )

    return <div>
      <div style={style.center}>
        <Link to={urls.call.list(this.props.params.id)}>
          <FlatButton label={this.state.report.localTeam.teamName} secondary={true} />
        </Link>
        <Link to={urls.call.list(this.props.params.id)}>
          <FlatButton label={this.state.report.visitorTeam.teamName} secondary={true} />
        </Link>
        <ReportProperty
          value={this.state.report.localTeam.result + ' - ' + this.state.report.visitorTeam.result}
          isTitle={true} />
      </div>
      <div style={style.container}>
        <ReportProperty name={'Term'} value={this.state.report.term} isPrimary={false} />
        <ReportProperty name={'Fouls'}
          value={this.state.report.localTeam.secondaryField + ' - ' + this.state.report.visitorTeam.secondaryField}
          isPrimary={false} />
      </div>
      <div style={style.center}>
        <ReportProperty value={this.state.report.time} isPrimary={true} />
        {playButton}
        <EditReport reportId={this.props.params.id} cronoUpdate={ReportActions.resetTime} time={this.state.report.time}
           termUpdate={ReportActions.updateTerm} term={this.state.report.term}/>
         <Link to={urls.event.list(this.props.params.id)}>
          <RaisedButton label='Events' secondary={true} style={style.button}/>
        </Link>
      </div>
      <hr/>
      <div style={style.center}>
        <div style={style.buttonRow}>
          {events}
        </div>
      </div>
      <Snackbar
        ref='snack'
        message={this.state.snackbarMessage}
        autoHideDuration={4000} />

      <EndMatchDialog reportId={this.props.params.id}
        matchTime={this.state.report.timer.ms} addMenuElements={this.addRigthMenuElements}/>
    </div>
  }

})

module.exports = Report
