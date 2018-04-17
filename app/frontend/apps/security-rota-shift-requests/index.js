import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import configureStore from '~/apps/store';

import reducers from './redux';
import { loadInitialData } from './redux/actions';
import SecurityRotaShiftRequestsPage from './containers/security-rota-shift-requests-page';


const securityShiftRequests = [
  {
    id: 1,
    startsAt: '2018-04-10T09:00:00.000Z',
    endsAt: '2018-04-10T10:00:00.000Z',
    venueId: 1,
    note: 'dfgdfg',
    shiftType: 'normal',
    status: 'pending',
  },
  {
    id: 2,
    startsAt: '2018-04-10T11:00:00.000Z',
    endsAt: '2018-04-10T12:00:00.000Z',
    venueId: 1,
    note: 'dfgdfhfgdhgfg',
    shiftType: 'stand_by',
    status: 'pending',
  },
  {
    id: 3,
    startsAt: '2018-04-10T13:00:00.000Z',
    endsAt: '2018-04-10T14:30:00.000Z',
    venueId: 1,
    note: 'dfggfhhgfdfg',
    shiftType: 'normal',
    status: 'pending',
  },
  {
    id: 4,
    startsAt: '2018-04-10T13:00:00.000Z',
    endsAt: '2018-04-10T14:30:00.000Z',
    venueId: 1,
    note: 'dfggfhhgfdfg',
    shiftType: 'normal',
    status: 'accepted',
  },
  {
    id: 5,
    startsAt: '2018-04-10T13:00:00.000Z',
    endsAt: '2018-04-10T14:30:00.000Z',
    venueId: 1,
    note: 'dfggfhhgfdfg',
    shiftType: 'stand_by',
    status: 'assigned',
    rotaShiftId: 9856,
  },
  {
    id: 6,
    startsAt: '2018-04-10T13:00:00.000Z',
    endsAt: '2018-04-10T14:30:00.000Z',
    venueId: 1,
    note: 'dfggfhhgfdfg',
    shiftType: 'stand_by',
    status: 'rejected',
  },

  {
    id: 7,
    startsAt: '2018-04-11T05:00:00.000Z',
    endsAt: '2018-04-11T07:00:00.000Z',
    venueId: 9,
    note: 'dfggfhhgfdfg',
    shiftType: 'normal',
    status: 'accepted',
  },
  {
    id: 8,
    startsAt: '2018-04-11T13:00:00.000Z',
    endsAt: '2018-04-11T14:30:00.000Z',
    venueId: 3,
    note: 'dfggfhhgfdfg',
    shiftType: 'stand_by',
    status: 'assigned',
  },
  {
    id: 9,
    startsAt: '2018-04-12T00:00:00.000Z',
    endsAt: '2018-04-12T01:30:00.000Z',
    venueId: 1,
    note: 'dfggfhhgfdfg',
    shiftType: 'stand_by',
    status: 'rejected',
  },
]

class SecurityRotaShiftRequestsApp extends Component {
  componentWillMount() {
    const { accessToken } = this.props;
    if (!accessToken) {
      throw new Error('Access token must be present');
    }
    window.boss.accessToken = accessToken;
    this.store = configureStore(reducers);
    this.store.dispatch(loadInitialData({...this.props, securityShiftRequests}));
  }

  render() {
    return (
      <Provider store={this.store}>
        <SecurityRotaShiftRequestsPage />
      </Provider>
    );
  }
}

SecurityRotaShiftRequestsApp.propTypes = {};

export default SecurityRotaShiftRequestsApp;
