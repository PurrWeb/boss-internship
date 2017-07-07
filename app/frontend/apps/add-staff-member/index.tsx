import * as React from 'react';
import {Provider} from 'react-redux';

import store from '../../store/index';
import App from './components/common-page-content';
import accessTokenChanged from '../../action-creators/access-token-changed';
import payratesChanged from '../../action-creators/pay-rates-changed';
import genderValuesChanged from '../../action-creators/gender-values-changed';
import staffTypesChanged from '../../action-creators/staff-types-changed';
import venuesChanged from '../../action-creators/venues-changed';
import {BossData} from '../../interfaces/common-data-types';

const Root = class extends React.Component <{}, {}> {
  componentDidMount() {
    const boss: BossData = (window as any).boss.store;

    store.dispatch( accessTokenChanged(boss.accessToken) );
    store.dispatch( payratesChanged(boss.payrateValues) );
    store.dispatch( genderValuesChanged(boss.genderValues) );
    store.dispatch( staffTypesChanged(boss.staffTypeIds) );
    store.dispatch( venuesChanged(boss.venueValues ) );
  }

  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
};

export default Root;
