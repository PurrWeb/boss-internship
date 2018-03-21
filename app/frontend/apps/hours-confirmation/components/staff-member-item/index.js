import React, { Component } from 'react';

export const STATUSES = {
  clocked_in: 'CLOCKED IN',
  clocked_out: 'CLOCKED OUT',
  on_break: 'ON BREAK',
};

export const STATUS_CLASSES = {
  clocked_in: 'clocked-in',
  clocked_out: 'clocked-out',
  on_break: 'on-break',
};

class StaffMemberItem extends Component {
  render() {
    return (
      <div className="boss-hrc boss-hrc_context_stack">
        {this.props.children}
      </div>
    );
  }
}

export default StaffMemberItem;
