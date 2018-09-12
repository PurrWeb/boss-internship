import React from 'react';
import axios from 'axios';
import oFetch from 'o-fetch';
import InviteAcceptForm from './invite-accept-form';

const acceptInviteRequest = (params, route) => {
  return axios.post(route, params);
};

class InvitesAccept extends React.Component {
  state = {
    password: null,
    confirmPassword: null,
  };

  handleSubmit = values => acceptInviteRequest(values, oFetch(this.props, 'postRoute'));

  render() {
    const initialValues = {
      password: null,
      confirmPassword: null,
    };
    return (
      <div>
        <header className="boss-page-header boss-page-header_adjust_security">
          <div className="boss-page-header__inner">
            <div className="boss-page-header__group boss-page-header__group_role_logo">
              <a className="boss-page-header__logo">Boss</a>
            </div>
          </div>
        </header>
        <main className="boss-page-main">
          <div className="boss-page-main__content">
            <div className="boss-page-main__inner">
              <div className="boss-modal-window boss-modal-window_role_accept-invite">
                <div className="boss-modal-window__header">
                  <h2 className="boss-modal-window__title">Accept Invite</h2>
                  <p className="boss-modal-window__subtitle">
                    Please fill in the following details to complete the sign up process.
                  </p>
                </div>
                <InviteAcceptForm onSubmit={this.handleSubmit} initialValues={initialValues} />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default InvitesAccept;
