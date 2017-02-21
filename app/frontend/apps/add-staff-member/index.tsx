import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import store from './store/index';
import App from './components/common-page-content';
import accessTokenChanged from './action-creators/access-token-changed';
import boss from './boss';
import payrateValuesChanged from './action-creators/payrate-values-changed';
import genderValuesChanged from './action-creators/gender-values-changed';
import staffTypeIdsChanged from './action-creators/staff-type-ids-changed';
import venueValuesChanged from './action-creators/venue-values-changed';
// tslint:disable-next-line:no-require-imports
require('./styles/index.scss');


store.dispatch( accessTokenChanged(boss.accessToken) );
store.dispatch( payrateValuesChanged(boss.payrateValues) );
store.dispatch( genderValuesChanged(boss.genderValues) );
store.dispatch( staffTypeIdsChanged(boss.staffTypeIds) );
store.dispatch( venueValuesChanged(boss.venueValues ) );

const Root = class extends React.Component <{}, {}> {
  render() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }
};

ReactDOM.render(
  <Root />,
  document.getElementById('root')
);
