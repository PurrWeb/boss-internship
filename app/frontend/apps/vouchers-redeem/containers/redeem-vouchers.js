import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Redeem from '../components/redeem';

const mapStateToProps = (state) => {
  return {
    vouchers: state.getIn(['page', 'vouchers']),
    venueStaffMembers: state.getIn(['page', 'venueStaffMembers']),
  };
}

@connect(mapStateToProps)
class RedeemVouchers extends React.Component {
  
  render() {
    return (
      <div>
        <div className="boss-page-main__dashboard">
          <div className="boss-page-main__inner">
            <div className="boss-page-dashboard boss-page-dashboard_updated">
              <div className="boss-page-dashboard__group">
                <h1 className="boss-page-dashboard__title">Redeem Vouchers</h1>
              </div>
            </div>
          </div>
        </div>
        <div className="boss-page-main__content">
          <div className="boss-page-main__inner">
            <Redeem
              venueStaffMembers={this.props.venueStaffMembers}
              vouchers={this.props.vouchers}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default RedeemVouchers
