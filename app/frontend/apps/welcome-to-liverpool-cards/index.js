import React, { Component } from 'react';
import { Provider } from 'react-redux';
import configureStore from '~/apps/store';

import reducers from './redux/reducers';
import { loadInitialData, getWtlCardsData } from './redux/actions';
import CardsPage from './containers/page';
import Spinner from '~/components/spinner';
import { getWtlCardsFilterQueryParams } from './selectors';
export default class WelcomeToLiverpoolCards extends Component {
  state = {
    fetching: true,
  };

  componentDidMount = async () => {
    const { accessToken } = this.props;
    if (!accessToken) {
      throw new Error('Access token must be present');
    }
    const filter = getWtlCardsFilterQueryParams();
    window.boss.accessToken = accessToken;

    this.store = configureStore(reducers);
    this.store.dispatch(loadInitialData(this.props));
    await this.store.dispatch(getWtlCardsData(filter));
    this.setState({ fetching: false });
  };

  render() {
    if (this.state.fetching) {
      return <Spinner />;
    }

    return (
      <Provider store={this.store}>
        <CardsPage />
      </Provider>
    );
  }
}
