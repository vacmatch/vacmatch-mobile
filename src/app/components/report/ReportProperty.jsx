import React from 'react'

let ReportProperty = React.createClass({
  propTypes: {
    name: React.PropTypes.string,
    value: React.PropTypes.string,
    isTitle: React.PropTypes.bool,
    isPrimary: React.PropTypes.bool
  },

  render: function () {
    let content = (
      <p>
        <small>{this.props.name}</small>: <span>{this.props.value}</span>
      </p>
      )

    if (this.props.isTitle) {
      content = (
        <h2>{this.props.value}</h2>
      )
    }
    if (this.props.isPrimary) {
      content = (
        <h4>{this.props.value}</h4>
      )
    }

    return <div>{content}</div>
  }
})

module.exports = ReportProperty
