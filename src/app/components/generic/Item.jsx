import React from 'react'

let Item = React.createClass({
  propTypes: {
    children: React.PropTypes.element
  },

  render: function () {
    return <div>{this.props.children}</div>
  }
})

module.exports = Item
