import React from 'react'
import mui from 'material-ui'
const Dialog = require('material-ui/lib/dialog')
import {FormattedMessage, injectIntl} from 'react-intl'

let FlatButton = mui.FlatButton
let TextField = mui.TextField

let EditReport = React.createClass({
  propTypes: {
    title: React.PropTypes.string,
    report: React.PropTypes.shape({
      _id: React.PropTypes.string,
      localTeam: React.PropTypes.shape({
        name: React.PropTypes.string
      }),
      visitorTeam: React.PropTypes.shape({
        name: React.PropTypes.string
      }),
      date: React.PropTypes.string,
      location: React.PropTypes.string
    }),
    dialogIsOpen: React.PropTypes.bool,
    toggleDialog: React.PropTypes.func,
    handleUpdate: React.PropTypes.func
  },

  handleUpdate: function () {
    let newReport = this.props.report
    newReport.localTeam.name = this.refs.localTeam.getValue()
    newReport.visitorTeam.name = this.refs.visitorTeam.getValue()
    newReport.date = this.refs.date.getValue()
    newReport.location = this.refs.location.getValue()
    this.props.handleUpdate(newReport)
  },

  render: function () {
    let customActions = [
      <FlatButton
        key={'dialog-cancel'}
        label={<FormattedMessage id='button.cancel'/>}
        secondary={true}
        onTouchTap={this.props.toggleDialog} />,
      <FlatButton
        key={'dialog-accept'}
        label={<FormattedMessage id='button.accept'/>}
        primary={true}
        onTouchTap={this.handleUpdate} />
    ]

    return (
      <div key={'dialog-div'}>
        <Dialog key={'dialog-edit-report'}
          ref='editDialog'
          title={this.props.title}
          actions={customActions}
          open={this.props.dialogIsOpen}>
            <div>
              <TextField ref='localTeam'
                key={'dialog-localTeam-field'}
                hintText={
                  <FormattedMessage
                      id='report.editReport.insertLocalTeam'
                      description='Insert visitor team text for input element'
                      defaultMessage='Insert local team'
                  />
                }
                floatingLabelText={
                  <FormattedMessage
                      id='report.editReport.modifyLocalTeam'
                      description='Modify local team text for input element'
                      defaultMessage='Modify local team'
                  />
                }
                defaultValue={this.props.report.localTeam ? this.props.report.localTeam.name : ''}/>
              <TextField ref='visitorTeam'
                key={'dialog-visitorTeam-field'}
                hintText={
                  <FormattedMessage
                      id='report.editReport.insertVisitorTeam'
                      description='Insert visitor team text for input element'
                      defaultMessage='Insert visitor team'
                  />
                }
                floatingLabelText={
                  <FormattedMessage
                      id='report.editReport.modifyVisitorTeam'
                      description='Modify visitor team text for input element'
                      defaultMessage='Modify visitor team'
                  />
                }
                defaultValue={this.props.report.visitorTeam ? this.props.report.visitorTeam.name : ''}/>
              <TextField ref='date'
                key={'dialog-date-field'}
                hintText={
                  <FormattedMessage
                      id='report.editReport.insertDate'
                      description='Insert date text for input element'
                      defaultMessage='Insert date'
                  />
                }
                floatingLabelText={
                  <FormattedMessage
                      id='report.editReport.modifyDate'
                      description='Modify date text for input element'
                      defaultMessage='Modify date'
                  />
                }
                defaultValue={this.props.report.date}/>
              <TextField ref='location'
                key={'dialog-place-field'}
                hintText={
                  <FormattedMessage
                      id='report.editReport.insertLocation'
                      description='Insert location text for input element'
                      defaultMessage='Insert location'
                  />
                }
                floatingLabelText={
                  <FormattedMessage
                      id='report.editReport.modifyLocation'
                      description='Modify location text for input element'
                      defaultMessage='Modify location'
                  />
                }
                defaultValue={this.props.report.location}/>
            </div>
        </Dialog>
      </div>
    )
  }

})

module.exports = injectIntl(EditReport)
