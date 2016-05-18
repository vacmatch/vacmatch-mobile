var React = require('react')
import mui from 'material-ui'
import {injectIntl, intlShape, defineMessages} from 'react-intl'

let Card = mui.Card
let CardMedia = mui.CardMedia
let CardTitle = mui.CardTitle
let CardText = mui.CardText
let List = mui.List
let ListItem = mui.ListItem
let FontIcon = mui.FontIcon

const messages = defineMessages({
  aboutTitle: {
    id: 'about.title',
    description: 'About title in card element',
    defaultMessage: 'About'
  },
  contactSection: {
    id: 'about.contactSection',
    description: 'Contact section text',
    defaultMessage: 'Contact'
  },
  email: {
    id: 'about.contactSection.email',
    description: 'Email item in list',
    defaultMessage: 'Email'
  },
  phone: {
    id: 'about.contactSection.phoneNumber',
    description: 'Phone number item in list',
    defaultMessage: 'Phone number'
  },
  socialSection: {
    id: 'about.socialSection',
    description: 'Social section text',
    defaultMessage: 'Social'
  },
  blog: {
    id: 'about.socialSection.blog',
    description: 'Blog item in list',
    defaultMessage: 'Blog'
  }
})

var About = React.createClass({

  propTypes: {
    intl: intlShape.isRequired
  },

  render: function () {
    let aboutTitle = this.props.intl.formatMessage(messages.aboutTitle)
    let contactSection = this.props.intl.formatMessage(messages.contactSection)
    let email = this.props.intl.formatMessage(messages.email)
    let phone = this.props.intl.formatMessage(messages.phone)
    let socialSection = this.props.intl.formatMessage(messages.socialSection)
    let blog = this.props.intl.formatMessage(messages.blog)

    return (
      <div>
        <Card>
          <CardMedia overlay={<CardTitle title={aboutTitle} subtitle='VACmatch'/>}>
            <img src='assets/img/futsal_night.jpg'/>
          </CardMedia>
          <CardText>
            <List subheader={contactSection}>
              <ListItem primaryText='info@vacmatch.com'
                        secondaryText={email}/>
              <ListItem primaryText='123 456 789'
                        secondaryText={phone}/>
            </List>
            <List subheader={socialSection}>
              <ListItem primaryText='Twitter' target='_blank' href='https://twitter.com/VACmatch' leftIcon={
                    <FontIcon className='fa fa-twitter'/>
              } />
              <ListItem primaryText={blog} target='_blank' href='https://medium.com/@VACmatch' leftIcon={
                    <FontIcon className='fa fa-medium'/>
              } />
              <ListItem primaryText='GitHub' target='_blank' href='https://github.com/vacmatch' leftIcon={
                    <FontIcon className='fa fa-github'/>
              } />
            </List>
          </CardText>
        </Card>
      </div>
    )
  }
})

module.exports = injectIntl(About)
