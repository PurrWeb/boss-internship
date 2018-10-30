import { createSelector } from 'reselect';
import Immutable from 'immutable';
import safeMoment from '~/lib/safe-moment';
import moment from 'moment';
import { DISCIPLINARY_LEVELS_MAP } from './constants';

export const warningsSelector = state => state.get('warnings');
export const warningLimitsSelector = state => state.get('warningLimits');
export const warningOptions = createSelector(warningsSelector, warningLimitsSelector, (warnings, warningLimits) => {
  return warnings.reduce((acc, warning, key) => {
    const data = {
      label: `${warning} (${warningLimits.get(key)})`,
      value: key,
    };
    return [...acc, data];
  }, []);
});
export const disciplinariesSelector = state => state.get('disciplinaries');
export const staffMemberSelector = state => state.getIn(['profile', 'staffMember']);
export const staffMemberFullName = createSelector(staffMemberSelector, staffMember => {
  return `${staffMember.get('first_name')} ${staffMember.get('surname')}`;
});
export const getGroupedByLevelDisciplinaries = createSelector(disciplinariesSelector, disciplinaries => {
  const now = moment();
  return Immutable.fromJS(DISCIPLINARY_LEVELS_MAP).map(levelId =>
    disciplinaries.filter(disciplinary => disciplinary.get('level') === levelId).map(disciplinary => {
      const isExpired = safeMoment.iso8601Parse(disciplinary.get('expiredAt')) <= now;
      return disciplinary.set('isExpired', isExpired);
    }),
  );
});
