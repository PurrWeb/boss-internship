import React from 'react';

import Header from './header';
import MainContent from './main-content';
import ResetPassword from './reset-password';
import oFetch from 'o-fetch';

class StaffMemberPasswordReset extends React.Component {
  render() {
    const verificationToken = oFetch(this.props, 'verificationToken');
    const actionDescription = oFetch(this.props, 'actionDescription');
    const successPath = oFetch(this.props, 'successPath');
    const requestPath = oFetch(this.props, 'requestPath');

    return (
      <div>
        <Header />
        <MainContent>
          <ResetPassword verificationToken={verificationToken} actionDescription={actionDescription} successPath={successPath} requestPath={requestPath} />
        </MainContent>
      </div>
    )
  }
}

export default StaffMemberPasswordReset
