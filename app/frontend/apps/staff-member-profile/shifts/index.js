import React from 'react';
import { Provider } from 'react-redux';
import { reducer as formReducer } from 'redux-form/immutable';

import configureStore from '../store';
import {initialProfileLoad} from '../profile-wrapper/actions';
import { initialLoad } from './redux/actions';
import { combineReducers } from 'redux-immutable';

import ShiftsContainer from './containers/shifts-container';

import profileReducer from '../profile-wrapper/reducers';
import venues from './redux/reducers/venues-reducer';
import pageOptions from './redux/reducers/page-options-reducer';
import hoursAcceptancePeriods from './redux/reducers/hours-acceptance-periods-reducer';
import hoursAcceptanceBreaks from './redux/reducers/hours-acceptance-breaks-reducer';
import rotaShifts from './redux/reducers/rota-shifts-reducer';

class StaffMemberShiftsApp extends React.Component {
  componentWillMount() {
    this.store = configureStore(combineReducers({
      venues,
      rotaShifts,
      pageOptions,
      hoursAcceptancePeriods,
      hoursAcceptanceBreaks,
      profile: profileReducer,
      form: formReducer,
    }));
    this.store.dispatch(initialProfileLoad({...this.props}));
    this.store.dispatch(initialLoad({...this.props}));
  }

  render() {
    return <Provider store={this.store}>
      <ShiftsContainer />
    </Provider>
  }
}

export default StaffMemberShiftsApp;
