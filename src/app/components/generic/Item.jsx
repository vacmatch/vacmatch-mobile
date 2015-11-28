import React from 'react'

let Item = React.createClass({
  propTypes: {
    children: React.PropTypes.arrayOf(React.PropTypes.element),
    id: React.PropTypes.string
  },

  render: function () {
    return <div key={'item-' + this.props.id}>{this.props.children}</div>
  }
})

module.exports = Item
