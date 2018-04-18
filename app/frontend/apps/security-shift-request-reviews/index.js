import React, { Component } from 'react';
import { Provider } from 'react-redux';
import configureStore from '~/apps/store';
import { loadInitialData } from './redux/actions';
import reducers from './redux/reducers';
import SecurityShiftRequestReviewsPage from './containers/security-shift-request-reviews-page';
import oFetch from 'o-fetch';

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
      venueId: 2,
      note: 'dfgdfhfgdhgfg',
      shiftType: 'stand_by',
      status: 'pending',
    },
    {
      id: 3,
      startsAt: '2018-04-10T13:00:00.000Z',
      endsAt: '2018-04-10T14:30:00.000Z',
      venueId: 3,
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
      shiftType: 'stand_by',
      status: 'assigned',
      rotaShiftId: 9856,
    },
    {
      id: 5,
      startsAt: '2018-04-10T13:00:00.000Z',
      endsAt: '2018-04-10T14:30:00.000Z',
      venueId: 1,
      note: 'dfggfhhgfdfg',
      shiftType: 'normal',
      status: 'accepted',
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
      startsAt: '2018-04-10T13:00:00.000Z',
      endsAt: '2018-04-10T14:30:00.000Z',
      venueId: 2,
      note: 'dfggfhhgfdfg',
      shiftType: 'stand_by',
      status: 'assigned',
      rotaShiftId: 9856,
    },
    {
      id: 8,
      startsAt: '2018-04-10T13:00:00.000Z',
      endsAt: '2018-04-10T14:30:00.000Z',
      venueId: 2,
      note: 'dfggfhhgfdfg',
      shiftType: 'normal',
      status: 'accepted',
    },
    {
      id: 9,
      startsAt: '2018-04-10T13:00:00.000Z',
      endsAt: '2018-04-10T14:30:00.000Z',
      venueId: 2,
      note: 'dfggfhhgfdfg',
      shiftType: 'stand_by',
      status: 'rejected',
    },
  ],
};

class SecurityShiftRequestReviewsApp extends Component {
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
    const startDate = oFetch(initialData, 'startDate');
    const endDate = oFetch(initialData, 'endDate');
    const venueId = oFetch(initialData, 'venueId');
    return (
      <Provider store={this.store}>
        <SecurityShiftRequestReviewsPage venueId={venueId} startDate={startDate} endDate={endDate}/>
      </Provider>
    );
  }
}

export default SecurityShiftRequestReviewsApp;
