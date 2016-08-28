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

var React = require('react')
import mui from 'material-ui'
import {injectIntl, intlShape, defineMessages} from 'react-intl'

let Card = mui.Card
let CardText = mui.CardText
let List = mui.List
let ListItem = mui.ListItem
let FontIcon = mui.FontIcon

const messages = defineMessages({
  title: {
    id: 'settings.settingsTitle',
    description: 'Settings title text',
    defaultMessage: 'Settings'
  },
  english: {
    id: 'settings.english',
    description: 'English text in item',
    defaultMessage: 'English'
  },
  language: {
    id: 'settings.language',
    description: 'Language text in item',
    defaultMessage: 'Language'
  }
})

var About = React.createClass({

  propTypes: {
    intl: intlShape.isRequired
  },

  render: function () {
    let title = this.props.intl.formatMessage(messages.title)
    let englishLanguage = this.props.intl.formatMessage(messages.english)
    let language = this.props.intl.formatMessage(messages.language)

    return (
      <div>
        <Card>
          <CardText>
            <List subheader={title}>
              <ListItem primaryText={englishLanguage}
                        secondaryText={language}
                        rightIcon={
                              <FontIcon className='fa fa-pencil'/>
                        } />
            </List>
          </CardText>
        </Card>
      </div>
    )
  }
})

module.exports = injectIntl(About)
