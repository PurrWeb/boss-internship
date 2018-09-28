import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import configureStore from '~/apps/store';

import reducers from './redux/reducers';
import { loadInitialData, getWtlClients } from './redux/actions';
import ClientsPage from './routes/clients-page';
import ProfilePage from './routes/profile-page';
import ProfileEdit from './routes/profile-edit';
import Spinner from '~/components/spinner';
import { getWtlClientsFilterQueryParams } from './selectors';

export default class WelcomeToLiverpoolClients extends Component {
  componentWillMount = () => {
    const { accessToken } = this.props;
    if (!accessToken) {
      throw new Error('Access token must be present');
    }

    window.boss.accessToken = accessToken;

    this.store = configureStore(reducers);
    this.store.dispatch(loadInitialData(this.props));
  };

  render() {
    return (
      <Provider store={this.store}>
        <Router>
          <Switch>
            <Route exact path="/" render={props => <ClientsPage />} />
            <Route
              exact
              path="/profile/:clientId?/edit"
              render={props => <ProfileEdit clientId={props.match.params.clientId} />}
            />
            <Route
              exact
              path="/profile/:clientId?"
              render={props => <ProfilePage clientId={props.match.params.clientId} />}
            />
          </Switch>
        </Router>
      </Provider>
    );
  }
}
