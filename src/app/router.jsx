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
