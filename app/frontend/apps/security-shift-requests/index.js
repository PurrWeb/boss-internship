import React, { Component } from 'react';
import { Provider } from 'react-redux';
import configureStore from '~/apps/store';
import { loadInitialData } from './redux/actions';
import reducers from './redux/reducers';
import SecurityShiftRequestsPage from './containers/security-shift-requests-page';

const initialData = {
  venueId: 1,
  startDate: '09-04-2018',
  endDate: '16-04-2018',
  securityShiftRequests: [
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
  ],
};

class SecurityShiftRequestsApp extends Component {
  componentWillMount() {
    const { accessToken } = this.props;
    if (!accessToken) {
      throw new Error('Access token must be present');
    }
    window.boss.accessToken = accessToken;
    this.store = configureStore(reducers);
    this.store.dispatch(loadInitialData(this.props));
  }
  render() {
    return (
      <Provider store={this.store}>
        <SecurityShiftRequestsPage />
      </Provider>
    );
  }
}

export default SecurityShiftRequestsApp;
