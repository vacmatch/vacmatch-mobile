import Reflux from 'reflux'

import SnackBarActions from '../../actions/SnackBarActions'
import ErrorActions from '../../actions/ErrorActions'

let ErrorHandlerStore = Reflux.createStore({
  listenables: ErrorActions,

  onGetLastError: function () {
    return SnackBarActions.getLastElement()
  },

  onSetError: function (newError) {
    // TODO Select error code and add i18n
    SnackBarActions.setElement(newError)
  }

})

export default ErrorHandlerStore
