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
          <CardText>
            <List subheader='Settings'>
              <ListItem primaryText='English'
                        secondaryText='Language'
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

module.exports = About
