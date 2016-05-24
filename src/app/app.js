import Router from './router'
import config from './api/config'

var app = {
  // Application Constructor
  initialize: function () {
    document.addEventListener('deviceready', () => {
      Router.start()
    }, false)
  }
}

let isMobile = config[config._type].deviceEvent

if (isMobile) {
  app.initialize()
} else {
  Router.start()
}
