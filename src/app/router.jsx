import React from 'react'
import ReactDOM from 'react-dom'
import { default as Router, Route, IndexRoute } from 'react-router'

import Layout from './components/layout'
import Home from './components/home'

// Routes
let routes = (
  <Route path='/' component={Layout}>
    <IndexRoute component={Home} />
    <Route path='/home' component={Home}/>
  </Route>
)

exports.start = function () {
  ReactDOM.render((<Router>{routes}</Router>), document.getElementById('container'))
}
