import React from 'react';
import { CssBaseline } from '@material-ui/core'
import store from 'src/app/store'
import { Provider } from 'react-redux'
import smoothscroll from 'smoothscroll-polyfill'

import { ThemeProvider } from '@material-ui/core/styles'
import { hot } from 'react-hot-loader'
import theme from 'src/theme'

import AllRouter from 'src/routes/index'
smoothscroll.polyfill()

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AllRouter />
      </ThemeProvider>
    </Provider>
  );
}

// Does nothing in production mode, just passes App through.
// see https://github.com/gaearon/react-hot-loader#note-about-hot
export default hot(module)(App)
