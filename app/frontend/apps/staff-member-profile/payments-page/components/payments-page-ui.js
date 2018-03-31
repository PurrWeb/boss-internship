import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ProfileWrapper from '../../profile-wrapper';
import { PaymentFilter } from './payment-filter';
import { PaymentTimeline } from './payment-timeline';
import oFetch from 'o-fetch';

const mapStateToProps = (state) => {
  const globalState = oFetch(state.toJS(), 'global');
  return {
    payments: oFetch(globalState, 'payments')
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: []
  };
}

@connect(mapStateToProps, mapDispatchToProps)
export class PaymentsPageUI extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    const payments = oFetch(this.props, 'payments');

    return <ProfileWrapper currentPage="payments">
      <section className="boss-board">
        <header className="boss-board__header">
          <h2 className="boss-board__title">Payments</h2>
        </header>
        <div className="boss-board__main">
          <div className="boss-board__manager">
            <div className="boss-board__manager-group boss-board__manager-group_role_data">
              <PaymentFilter />
							<PaymentTimeline payments={payments}/>
              <div className="boss-board__manager-actions">
              </div>
            </div>
          </div>
        </div>
      </section>
    </ProfileWrapper>;
  }
}
