import React from 'react';

import Header from './header';
import MainContent from './main-content';
import ResetPassword from './reset-password';

class StaffMemberPasswordReset extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <MainContent>
          <ResetPassword verificationToken={this.props.verificationToken} />
        </MainContent>
      </div>
    )
  }
}

export default StaffMemberPasswordReset
