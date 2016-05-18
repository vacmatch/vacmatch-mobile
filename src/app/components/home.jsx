var React = require('react')
import {FormattedMessage} from 'react-intl'

var Home = React.createClass({

  render: function () {
    return (
      <div className='hero-unit'>
        <FormattedMessage
            id='greeting'
            description='Greeting to welcome the user to the app'
            defaultMessage='Hello, {name}!'
            values={{
              name: 'Eric'
            }}
        />

        <h1>'Allo, 'Allo!</h1>
        <p>Welcome to this awesome APP ;)</p>
      </div>
    )
  }
})

module.exports = Home
