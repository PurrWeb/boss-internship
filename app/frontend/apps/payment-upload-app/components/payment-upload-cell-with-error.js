import React from "react";
import oFetch from "o-fetch";
import { Tooltip } from "react-tippy";

class ToolTipContent extends React.Component {
  render() {
    return (
      <div>
        <button
          type="button"
          onClick={this.props.onCloseClick}
          style={{ pointerEvents: 'all' }}
          className="boss-popover__close js-popover-close"
        >Close</button>
        <div className="boss-popover__inner">
          <div className="boss-popover__text boss-popover__text_role_primary">
            {this.props.contentComponent()}
          </div>
        </div>
      </div>
    )
  }
}

class PaymentUploadCellWithError extends React.Component {
  state = {
    toolTipOpen: false,
  }

  openTooltip = () => {
    this.setState({ toolTipOpen: true });
  }

  closeTooltip = () => {
    this.setState({ toolTipOpen: false });
  }

  render() {
    const header = oFetch(this.props, "header");
    const rawValue = oFetch(this.props, "rawValue");
    const error = oFetch(this.props, "error");
    const toolTipOpen = oFetch(this.state, "toolTipOpen");

    return (
      <div onClick={this.openTooltip} className="boss-table__cell boss-table__cell_state_alert">
        <Tooltip
          html={<ToolTipContent onCloseClick={this.closeTooltip} contentComponent={() => {
            return (
              <div>
                <span className="boss-popover__text-marked">{header}</span>
                <div>{error}</div>
              </div>
            )
          }} />}
          open={this.state.toolTipOpen}
          hideOnClick={false}
          arrow
          theme="light"
          style={{ display: 'block' }}
        >
          <div className="boss-table__info">
            <p className="boss-table__label boss-table__label_state_alert">{header}</p>
            <p className="boss-table__text boss-table__text_state_alert">{rawValue}</p>
          </div>
        </Tooltip>
      </div>
    )
  }
}

export default PaymentUploadCellWithError;
