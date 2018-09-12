import Immutable from 'immutable';
import { handleActions } from 'redux-actions';
import oFetch from 'o-fetch';
import uuid from 'uuid/v1';

import * as types from '../types';

const initialState = Immutable.List();
export default handleActions(
  {
    [types.LOAD_INITIAL_DATA]: (state, action) => {
      const financeReports = oFetch(action, 'payload.financeReports');
      return Immutable.fromJS(financeReports).map(financeReport =>
        financeReport.set('frontendId', financeReport.get('id') === null ? uuid() : financeReport.get('id')),
      );
    },
    [types.MARK_REPORTS_COMPLETED]: (state, action) => {
      const updatedFinanceReports = oFetch(action, 'payload.financeReports');

      const newFinanseReports = state.withMutations(reports => {
        updatedFinanceReports.forEach(report => {
          const reportIndex = state.findIndex(r => r.get('frontendId') === report.id);
          if (reportIndex === -1) {
            throw new Error(`Can't find finance report with id: ${report.id}`);
          }
          reports.set(reportIndex, Immutable.fromJS({...report, frontendId: report.id}));
        });
      });
      return newFinanseReports;
    },
  },
  initialState,
);
