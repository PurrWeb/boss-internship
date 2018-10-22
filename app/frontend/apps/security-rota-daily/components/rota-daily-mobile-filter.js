import React from 'react';
import { connect } from 'react-redux';

import RotaDayFilter from './rota-day-filter';
import RotaFilter from '~/components/security-rota/security-rota-filter';

const mapStateToProps = state => {
  return {
    rotaDate: state.getIn(['page', 'date']),
    securityShiftRequestsCount: state.getIn(['page', 'securityShiftRequestsCount']),
  };
};

function RotaDailyMobileFilter({ rotaDate, securityShiftRequestsCount }) {
  return (
    <div className="boss-page-main__content boss-page-main__content_context_stack boss-page-main__content_mobile">
      <div className="boss-page-main__inner">
        <div className="boss-form">
          <div className="boss-form__row boss-form__row_justify_space boss-form__row_position_last">
            <RotaFilter securityShiftRequestsCount={securityShiftRequestsCount} currentRotaDay={rotaDate} page="daily" />
          </div>
          <div className="boss-form__row boss-form__row_justify_space boss-form__row_position_last">
            <RotaDayFilter desktop={false} currentRotaDay={rotaDate} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default connect(mapStateToProps)(RotaDailyMobileFilter);
