import React from 'react';
import { Field, Fields, reduxForm, SubmissionError } from 'redux-form/immutable';
import DatePicker from 'react-datepicker';
import { fromJS, Map, List } from 'immutable';
import moment from 'moment';

import BossFormSelect from '~/components/boss-form/boss-form-select';

import RedeemBadge from './redeem-badge';

class RedeemForm extends React.Component {
  render() {
    const {
      handleSubmit,
      submitting,
      submission,
    } = this.props;

    return (
      <form onSubmit={handleSubmit(submission)} className="boss-form">
        <div className="boss-form__row boss-form__row_adjust_rv">
          <RedeemBadge
            caption="Staff Member"
            figureSrc="http://boss-styles.herokuapp.com/images/user-light-gray.svg"
          >
            <Field
              component={BossFormSelect}
              name="staffMemberId"
              optionValue="id"
              optionLabel="full_name"
              normalizeLabel={(option) => `(${option.venue_name}) ${option.full_name}`}
              placeholder="Select staff member ..."
              options={this.props.staffMembers.toJS()}
            />
          </RedeemBadge>
          <RedeemBadge
            caption="Voucher"
            figureSrc="http://boss-styles.herokuapp.com/images/ticket-light-gray.svg"
          >
            <Field
              component={BossFormSelect}
              name="voucherId"
              optionLabel="description"
              normalizeLabel={(option) => `(${option.venue_name}) ${option.description}`}
              optionValue="id"
              placeholder="Select voucher ..."
              options={this.props.vouchers.toJS()}
            />
          </RedeemBadge>
        </div>
        <div className="boss-form__field boss-form__field_justify_end-center">
          <button
            className="boss-button boss-form__submit"
            type="submit"
            disabled={submitting}
          >Redeem</button>
        </div>
      </form>
    )
  }
};

export default reduxForm({
  form: 'redeem-form',
})(RedeemForm);
