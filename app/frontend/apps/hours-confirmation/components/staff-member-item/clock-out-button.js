import React from 'react';
import oFetch from 'o-fetch';
import AsyncButton from 'react-async-button';

class ClockOutButton extends React.Component {
  render() {
    const status = oFetch(this.props, 'status');

    if (status === 'clocked_out') {
      return null;
    }

    return (
      <div className="boss-hrc__action">
        <AsyncButton
          className="boss-button boss-button_type_small boss-button_role_exclamation boss-hrc__action-btn"
          text="Clock Out"
          pendingText="Clocking Out ..."
          onClick={this.props.onClockOut}
        />
        <p className="boss-hrc__action-text">Clock out to edit hours.</p>
      </div>
    );
  }
}

export default ClockOutButton;
