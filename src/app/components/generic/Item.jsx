import React from 'react'

let Item = React.createClass({
  propTypes: {
    children: React.PropTypes.arrayOf(React.PropTypes.element),
    _id: React.PropTypes.string
  },

  render: function () {
    return <div key={'item-' + this.props._id}>{this.props.children}</div>
  }
})

module.exports = Item
