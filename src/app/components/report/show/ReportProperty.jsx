//
// Copyright (c) 2016 by VACmatch
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//

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
