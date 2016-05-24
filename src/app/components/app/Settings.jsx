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
