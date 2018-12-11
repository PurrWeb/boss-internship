import React, { Component } from 'react';
import oFetch from 'o-fetch';

export default class StaffMembersListWrapper extends Component {
  render() {
    const [title, children] = oFetch(this.props, 'title', 'children');
    return (
      <div className="boss-page-main__group boss-page-main__group_adjust_staff-vetting boss-page-main__group_highlight_alert boss-page-main__group_context_stack">
        <div className="boss-users">
          {title && <h3 className="boss-users__flow-title boss-users__flow-title_role_alert">{title}</h3>}
          <div className="boss-users__flow boss-users__flow_type_no-space">{children}</div>
        </div>
      </div>
    );
  }
}

StaffMembersListWrapper.defaultProps = {
  title: null,
};
