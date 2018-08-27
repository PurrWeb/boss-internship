import React from 'react';
import { combineReducers } from 'redux-immutable';
import { reducer as formReducer, SubmissionError } from 'redux-form/immutable';
import { modalRedux } from '~/components/modals';
import safeMoment from '~/lib/safe-moment';
import oFetch from 'o-fetch';
import EditAccessoryRequestForm from './edit-accessory-request-form';

class EditAccessoryRefundRequest extends React.Component {
  handleSubmit = (values, dispatch) => {
    return this.props.onSubmit(values.toJS(), dispatch).catch(resp => {
      const errors = resp.response.data.errors;
      if (errors) {
        let base = {};

        if (errors.base) {
          base = {
            _error: errors.base,
          };
        }
        throw new SubmissionError({ ...errors, ...base });
      }
      return resp;
    });
  };

  render() {
    const accessoryRequest = oFetch(this.props, 'accessoryRequest');
    const sPayslipDate = oFetch(accessoryRequest, 'refundPayslipDate');
    const accessoryRequestId = oFetch(accessoryRequest, 'id');
    const initialValues = {
      accessoryRequestId,
      payslipDate: safeMoment.uiDateParse(sPayslipDate),
    };

    return <EditAccessoryRequestForm onSubmit={this.handleSubmit} initialValues={initialValues} />;
  }
}
export default modalRedux(combineReducers({ form: formReducer }))(EditAccessoryRefundRequest);
