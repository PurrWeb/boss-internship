import React from 'react';
import { SubmissionError } from 'redux-form/immutable';
import { fromJS } from 'immutable';

import moment from 'moment';

import RedeemForm from './redeem-form';
import {
  redeemVoucher,
} from '../actions';

class Redeem extends React.Component {
  submission = (values, dispatch) => {
    return dispatch(redeemVoucher(values.toJS()))
  }
  
  render() {
    const initialValues = {
      staffMemberId: null,
      voucherId: null,
    }

    return (
      <div className="boss-page-main__group boss-page-main__group_adjust_rv-form">
        <RedeemForm
          submission={this.submission}
          initialValues={initialValues}
          vouchers={this.props.vouchers}
          staffMembers={this.props.venueStaffMembers}
        />
      </div>
    )
  }
}

export default Redeem;
