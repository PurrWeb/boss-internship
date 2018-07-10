import React from 'react'
import {
  Route,
} from 'react-router-dom'
import UnauthorizedPage from './unauthorized-page';

export default ({ render, canView, ...rest }) => (
  <Route {...rest} render={(props) => (
    canView
      ? render()
      : <UnauthorizedPage />
  )} />
)