import React from 'react';
import oFetch from 'o-fetch';

class PaymentUploadPageBoard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const header = oFetch(this.props, 'header');
    const rawValue = oFetch(this.props, 'rawValue');
    const error = oFetch(this.props, 'error');

    return <div key={ `tableCell:${header}` } className="boss-table__cell boss-table__cell_state_alert js-popover-container" data-popover="2">
      <div className="boss-table__info">
        <p className="boss-table__label boss-table__label_state_alert">{ header }</p>
        <p className="boss-table__text boss-table__text_state_alert">{ rawValue }</p>
      </div>

      <div className="boss-popover boss-popover_context_csv-upload-error js-popover" data-popover="2">
        <a href="#" className="boss-popover__close js-popover-close">Close</a>
        <div className="boss-popover__inner">
          <p className="boss-popover__text boss-popover__text_role_primary boss-popover__text_adjust_wrap"><span className="boss-popover__text-marked">{ header }</span> { error }</p>
        </div>
      </div>
    </div>
  }
}

export default PaymentUploadPageBoard;
