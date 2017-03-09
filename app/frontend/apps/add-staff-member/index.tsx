import * as React from 'react';
import {Provider} from 'react-redux';

import store from '../../store/index';
import App from './components/common-page-content';
import accessTokenChanged from '../../action-creators/access-token-changed';
import payrateValuesChanged from '../../action-creators/payrate-values-changed';
import genderValuesChanged from '../../action-creators/gender-values-changed';
import staffTypesChanged from '../../action-creators/staff-type-ids-changed';
import venueValuesChanged from '../../action-creators/venue-values-changed';
import {BossData} from '../../interfaces/common-data-types';

const Root = class extends React.Component <{}, {}> {
  componentDidMount() {
    const boss: BossData = (window as any).boss;

    store.dispatch( accessTokenChanged(boss.accessToken) );
    store.dispatch( payrateValuesChanged(boss.payrateValues) );
    store.dispatch( genderValuesChanged(boss.genderValues) );
    store.dispatch( staffTypesChanged(boss.staffTypeIds) );
    store.dispatch( venueValuesChanged(boss.venueValues ) );
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
