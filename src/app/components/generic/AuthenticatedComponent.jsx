import React from 'react'
import Reflux from 'reflux'
import { History } from 'react-router'

import AuthStore from '../../stores/AuthStore'
import urls from '../../api/urls'
import config from '../../api/config'

export default (ComposedComponent) => {
  let AuthenticatedComponent = React.createClass({
    mixins: [
      Reflux.connect(AuthStore, 'auth'),
      History
    ],

    componentWillMount: function (transition) {
      if (config._env !== 'development') {
        // This method is called before transitioning to this component. If the user is not logged in, we’ll send him or her to the Login page.
        if (!AuthStore.isLoggedIn()) {
          this.history.pushState(null, urls.login.show)
        }
      }
    },

    render: function () {
      return (
        <ComposedComponent
        {...this.props} />
      )
    }
  })
  return AuthenticatedComponent
}
