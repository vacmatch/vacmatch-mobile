import React from 'react'
import ReactDOM from 'react-dom'
import { default as Router, Route, IndexRoute } from 'react-router'

import Layout from './components/layout'
import Home from './components/home'
import About from './components/app/About'
import Settings from './components/app/Settings'
import Login from './components/auth/Login'
import ReportList from './components/report/list/ReportList'
import Report from './components/report/show/Report'
import EndReport from './components/report/end/EndReport'
import PersonList from './components/event/add/PersonList'
import EventList from './components/event/list/EventList'
import CallList from './components/call/CallList'

// Routes
let routes = (
  <Route path='/' component={Layout}>
    <IndexRoute component={Home} />
    <Route path='/home' component={Home}/>
    <Route path='/about' component={About}/>
    <Route path='/settings' component={Settings}/>
    <Route path='/login' component={Login}/>
    <Route path='/reports' component={ReportList}/>
    <Route path='/report/:reportId' component={Report}/>
    <Route path='/call/report/:reportId' component={CallList}/>
    <Route path='/end/report/:reportId' component={EndReport}/>
    <Route path='/addEvent/:reportId/:eventType' component={PersonList}/>
    <Route path='/events/:reportId' component={EventList}/>
  </Route>
)

exports.start = function () {
  ReactDOM.render((<Router>{routes}</Router>), document.getElementById('container'))
}
