import React from 'react'
import Reflux from 'reflux'
import mui from 'material-ui'
import { Link } from 'react-router'

import style from './report-style'
import ReportProperty from './ReportProperty'
import EditReport from './EditReport'
import ReportStore from '../../../stores/ReportStore'
import ReportActions from '../../../actions/ReportActions'
import urls from '../../../api/urls'

let FlatButton = mui.FlatButton
let RaisedButton = mui.RaisedButton

let Report = React.createClass({
  mixins: [Reflux.connect(ReportStore, 'report')],

  propTypes: {
    params: React.PropTypes.shape({
      id: React.PropTypes.string
    })
  },

  componentWillMount: function () {
    ReportActions.updateReportTeams(this.props.params.id)
  },

  render: function () {
    let playButtonLabel = 'Play'
    if (this.state.report.isPlaying) {
      playButtonLabel = 'Stop'
    }

    return <div>
      <div style={style.center}>
        <FlatButton label={this.state.report.localTeam.teamName} secondary={true} />
        <FlatButton label={this.state.report.visitorTeam.teamName} secondary=	{true} />
        <ReportProperty value={'0 - 2'} isTitle={true} />
      </div>
      <div style={style.container}>
        <ReportProperty name={'Term'} value={this.state.report.term} isPrimary={false} />
        <ReportProperty name={'Fouls'} value={'3 - 3'} isPrimary={false} />
      </div>
      <div style={style.center}>
        <ReportProperty value={this.state.report.time} isPrimary={true} />
        <FlatButton label={playButtonLabel} primary={true} onClick={ReportActions.updateTime} />
        <EditReport cronoUpdate={ReportActions.resetTime} time={this.state.report.time}
           termUpdate={ReportActions.updateTerm} term={this.state.report.term}/>
      </div>
      <hr/>
      <div style={style.center}>
        <div style={style.buttonRow}>
          <Link to={urls.event.add(this.props.params.id, 'goal')}>
            <RaisedButton label='Goal' primary={true} style={style.button} />
          </Link>
          <Link to={urls.event.add(this.props.params.id, 'foul')}>
            <RaisedButton label='Foul' primary={true} style={style.button} />
          </Link>
        </div>
        <div style={style.buttonRow}>
          <RaisedButton label='Yellow card' primary={true} style={style.button} />
          <RaisedButton label='Red card' primary={true} style={style.button} />
        </div>
      </div>
    </div>
  }

})

module.exports = Report
