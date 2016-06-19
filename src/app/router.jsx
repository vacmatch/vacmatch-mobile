import React from 'react'
import ReactDOM from 'react-dom'
import { default as Router, Route, IndexRoute } from 'react-router'

import Layout from './components/layout'
import About from './components/app/About'
import Settings from './components/app/Settings'
import Login from './components/auth/Login'
import ReportList from './components/report/list/ReportList'
import Report from './components/report/show/Report'
import EndReport from './components/report/end/EndReport'
import PersonList from './components/event/add/PersonList'
import EventList from './components/event/list/EventList'
import CallList from './components/call/CallList'
import {addLocaleData, IntlProvider} from 'react-intl'
import en from 'react-intl/locale-data/en'
import es from 'react-intl/locale-data/es'
import esMessages from '../../i18n/messages/es'
import enMessages from '../../i18n/messages/en'

addLocaleData([...en, ...es])

let locale = navigator.language

let messages = enMessages
if (locale === 'es') {
  messages = esMessages
}

// Routes
let routes = (
  <Route path='/' component={Layout}>
    <IndexRoute component={Login} />
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
  ReactDOM.render(
    <IntlProvider locale={locale} messages={messages}>
      <Router>
        {routes}
      </Router>
    </IntlProvider>,
    document.getElementById('container'))
}
