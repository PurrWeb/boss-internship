import React, { Component } from 'react';

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
