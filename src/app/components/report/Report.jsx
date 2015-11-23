import React from 'react'
import Reflux from 'reflux'
import mui from 'material-ui'

import style from './report-style'
import ReportProperty from './ReportProperty'
import EditReport from './EditReport'
import ReportStore from '../../stores/ReportStore'
import ReportActions from '../../actions/ReportActions'

let FlatButton = mui.FlatButton
let RaisedButton = mui.RaisedButton

let Report = React.createClass({
  mixins: [Reflux.connect(ReportStore, 'report')],

  render: function () {
    let playButtonLabel = 'Play'
    if (this.state.crono.isPlaying) {
      playButtonLabel = 'Stop'
    }

    return <div>
      <div style={style.center}>
        <FlatButton label='Local' secondary={true} />
        <FlatButton label='Visitor' secondary=	{true} />
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
          <RaisedButton label='Goal' primary={true} style={style.button} />
          <RaisedButton label='Foul' primary={true} style={style.button} />
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
