var React = require('react')
import mui from 'material-ui'

let Card = mui.Card
let CardMedia = mui.CardMedia
let CardTitle = mui.CardTitle
let CardText = mui.CardText
let List = mui.List
let ListItem = mui.ListItem
let FontIcon = mui.FontIcon

var About = React.createClass({

  render: function () {
    return (
      <div>
        <Card>
          <CardMedia overlay={<CardTitle title='About' subtitle='VACmatch'/>}>
            <img src='assets/img/futsal_night.jpg'/>
          </CardMedia>
          <CardText>
            <List subheader='Contacto'>
              <ListItem primaryText='info@vacmatch.com'
                        secondaryText='Email'/>
              <ListItem primaryText='123 456 789'
                        secondaryText='Phone number'/>
            </List>
            <List subheader='Social'>
              <ListItem primaryText='Twitter' target='_blank' href='https://twitter.com/VACmatch' leftIcon={
                    <FontIcon className='fa fa-twitter'/>
              } />
              <ListItem primaryText='Blog' target='_blank' href='https://medium.com/@VACmatch' leftIcon={
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

module.exports = About
