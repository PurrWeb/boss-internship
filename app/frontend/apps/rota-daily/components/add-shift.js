import React from 'react';
import AddShiftForm from './add-shift-form';
import { SubmissionError } from 'redux-form/immutable';
import {confirmation} from '~/lib/confirm-utils';

import {
  addShift,
} from '../actions';

const ROTA_PUBLISHED_STATUS = "published";

export function handleSubmit(values, dispatch, props) {
  const status = props.rotaStatus;
  const action = () => {
    return dispatch(addShift(values.toJS()))
      .catch(resp => {
        if (resp.response && resp.response.data && resp.response.data.errors) {
          let errors = resp.response.data.errors;
          if (errors) {
            if (errors.base) {
              errors._error = errors.base
            }

            throw new SubmissionError({...errors});
          }
        }
        throw resp;
      });
  }

  if (status === ROTA_PUBLISHED_STATUS) {
    return confirmation(["Publishing a rota will send out email confirmations and can't be undone.", "Do you want to continue?"], {
      title: 'WARNING !!!',
      id: 'rota-daily-confirmation'
    }).then(() => {
      return action();
    });
  } else {
    return action();
  }
}

class AddShift extends React.Component {
  handleSubmit = (values, dispatch, props) => {
    return handleSubmit(values, dispatch, props).then(() => {
      this.props.handleAfterAdd();
    })
  }

  render() {
    const {
      staffMember,
      rotaDate,
    } = this.props;

    const initialValues = {
      staff_member_id: staffMember.get('id'),
      starts_at: null,
      ends_at: null,
      shift_type: "normal",
    }

    return (
      <AddShiftForm
        submittion={this.handleSubmit}
        initialValues={initialValues}
        rotaDate={rotaDate}
        rotaStatus={this.props.rotaStatus}
        handleAfterAdd={this.props.handleAfterAdd}
      />
    )
  }
}

export default AddShift;
