import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import oFetch from 'o-fetch';
import utils from '~/lib/utils';
import safeMoment from '~/lib/safe-moment';
import { combineReducers } from 'redux-immutable';
import { reducer as formReducer, SubmissionError } from 'redux-form/immutable';
import { modalRedux } from '~/components/modals';
import AssignConfirmForm from './assign-confirm-form';

class AssignConfirm extends React.PureComponent {
  render() {
    const avatarUrl = oFetch(this.props, 'avatarUrl');
    const staffMemberId = oFetch(this.props, 'staffMemberId');
    const fullName = oFetch(this.props, 'fullName');
    const shiftRequest = oFetch(this.props, 'shiftRequest');
    const onSubmit = oFetch(this.props, 'onSubmit');
    const rotaShifts = oFetch(this.props, 'rotaShifts');

    const startsAt = oFetch(shiftRequest, 'startsAt');
    const endsAt = oFetch(shiftRequest, 'endsAt');
    const venueName = oFetch(shiftRequest, 'venueName');

    const initialValues = {
      staffMemberId,
      startsAt,
      endsAt,
    };

    return (
      <AssignConfirmForm
        avatarUrl={avatarUrl}
        fullName={fullName}
        venueName={venueName}
        startsAt={startsAt}
        endsAt={endsAt}
        onFormSubmit={onSubmit}
        initialValues={initialValues}
        rotaShifts={rotaShifts}
      />
    );
  }
}

AssignConfirm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default modalRedux(combineReducers({ form: formReducer }))(AssignConfirm);
