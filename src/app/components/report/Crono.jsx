import React from 'react'
import mui from 'material-ui'
import Stopwatch from 'timer-stopwatch'

import ReportProperty from './ReportProperty'
import EditReport from './EditReport'

let FlatButton = mui.FlatButton

let Crono = React.createClass({

  propTypes: {
    initTime: React.PropTypes.number
  },

  getInitialState: function () {
    return {
      isPlaying: false,
      timer: new Stopwatch(this.props.initTime),
      time: this.milisecondsToString(this.props.initTime)
    }
  },

  // Parse crono string and convert it to milisecond
  stringToMiliseconds: function (time) {
    let elements = time.split(':')
    return (parseInt(elements[0], 10) * 60000) + (parseInt(elements[1], 10) * 1000)
  },

  // Create crono string from milisecond
  milisecondsToString: function (miliseconds) {
    let date = new Date(miliseconds)
    return (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() +
      ' : ' + (date.getSeconds() < 10 ? '0' : '') + date.getSeconds()
  },

  _togglePlay: function () {
    this.state.timer.on('time', (time) => {
      this.setState({ time: this.milisecondsToString(time.ms) })
    })
    this.state.timer.startstop()
    this.setState({
      isPlaying: !this.state.isPlaying
    })
  },

  _resetPlay: function (string) {
    let miliseconds = this.stringToMiliseconds(string)
    this.state.timer.stop()
    this.setState({
      isPlaying: false,
      timer: new Stopwatch(miliseconds),
      time: this.milisecondsToString(miliseconds)
    })
  },

  render: function () {
    let playButtonLabel = 'Play'
    if (this.state.isPlaying) {
      playButtonLabel = 'Stop'
    }

    return <div>
      <ReportProperty value={this.state.time} isPrimary={true} />
      <FlatButton label={playButtonLabel} primary={true} onClick={this._togglePlay} />
      <EditReport cronoUpdate={this._resetPlay} time={this.state.time}/>
    </div>
  }
})

module.exports = Crono
