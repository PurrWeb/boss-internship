import { createSelector } from 'reselect';
import Immutable from 'immutable';
import safeMoment from '~/lib/safe-moment';
import moment from 'moment';
import { DISCIPLINARY_LEVELS_MAP } from './constants';

export const disciplinariesSelector = state => state.get('disciplinaries');

export const getGroupedByLevelDisciplinaries = createSelector(disciplinariesSelector, disciplinaries => {
  const now = moment();
  return Immutable.fromJS(DISCIPLINARY_LEVELS_MAP).map(levelId =>
    disciplinaries.filter(disciplinary => disciplinary.get('level') === levelId).map(disciplinary => {
      const isExpired = safeMoment.iso8601Parse(disciplinary.get('expiredAt')) <= now;
      return disciplinary.set('isExpired', isExpired);
    }),
  );
});
