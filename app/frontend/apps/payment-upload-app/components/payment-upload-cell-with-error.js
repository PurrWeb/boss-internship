import React from 'react';
import oFetch from 'o-fetch';
import { Tooltip } from 'react-tippy';

class PaymentUploadPageBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toolTipOpen: false
    }
  }

  popup(){
    const header = oFetch(this.props, 'header');
    const error = oFetch(this.props, 'error');

    return <div className="" data-popover="2">
      <a href="#" className="boss-popover__close js-popover-close" onClick={this.toggleToolTip} >Close</a>
      <div className="boss-popover__inner">
        <p className="boss-popover__text boss-popover__text_role_primary boss-popover__text_adjust_wrap"><span className="boss-popover__text-marked">{ header }</span> { error }</p>
      </div>
    </div>
  }

  toggleToolTip() {
    console.log("toggleToolTip()")
    this.setState((prevState, props) => {
      return {
        toolTipOpen: !prevState.toolTipOpen
      }
    })
  }

  render() {
    const header = oFetch(this.props, 'header');
    const rawValue = oFetch(this.props, 'rawValue');
    const error = oFetch(this.props, 'error');
    const toolTipOpen = oFetch(this.state, 'toolTipOpen');

    return <Tooltip key={`tableCell:${header}`} position="bottom" trigger="click" open={toolTipOpen} html={ this.popup() } onRequestClose={() => { console.log('onRequestClose()'); setIsOpen(false) }} >
      <div className="boss-table__cell boss-table__cell_state_alert js-popover-container" data-popover="2">
        <div className="boss-table__info">
          <p className="boss-table__label boss-table__label_state_alert">{ header }</p>
          <p className="boss-table__text boss-table__text_state_alert">{ rawValue }</p>
        </div>

      </div>
    </Tooltip>
  }
}

export default PaymentUploadPageBoard;
