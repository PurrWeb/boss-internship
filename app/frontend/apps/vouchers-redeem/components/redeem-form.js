import React from 'react';
import { Field, Fields, reduxForm, SubmissionError } from 'redux-form/immutable';
import { fromJS, Map, List } from 'immutable';
import oFetch from 'o-fetch';

import BossFormSelect from '~/components/boss-form/boss-form-select';

import StaffMemberBadge from './staff-member-badge';
import VoucherBadge from './voucher-badge';

class RedeemForm extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      selectedStaffMember: undefined
    }
  }

  selectChanged(event, value){
    let selectedStaffMember = undefined;
    if(value){
      selectedStaffMember = this.props.staffMembers.toJS().find(
        (staffMember) => {
          return oFetch(staffMember, 'id') == value
        }
      );
    }
    this.setState({
      selectedStaffMember: selectedStaffMember
    })
  }

  render() {
    const {
      handleSubmit,
      submitting,
      submission,
    } = this.props;

    let avatarUrl = this.state.selectedStaffMember ? oFetch(this.state.selectedStaffMember, 'avatar_url') : undefined;

    return (
      <form onSubmit={handleSubmit(submission)} className="boss-form">
        <div className="boss-form__row boss-form__row_adjust_rv">
          <StaffMemberBadge avatarUrl={avatarUrl}>
            <Field
              component={BossFormSelect}
              name="staffMemberId"
              optionValue="id"
              optionLabel="full_name"
              normalizeLabel={(option) => `(${option.venue_name}) ${option.full_name}`}
              placeholder="Select staff member ..."
              options={this.props.staffMembers.toJS()}
              onChange={this.selectChanged.bind(this)}
            />
          </StaffMemberBadge>
          <VoucherBadge>
            <Field
              component={BossFormSelect}
              name="voucherId"
              optionLabel="description"
              normalizeLabel={(option) => `(${option.venue_name}) ${option.description}`}
              optionValue="id"
              placeholder="Select voucher ..."
              options={this.props.vouchers.toJS()}
            />
          </VoucherBadge>
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
