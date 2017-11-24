import React from 'react';
import oFetch from 'o-fetch';
import safeMoment from "~/lib/safe-moment";
import utils from "~/lib/utils";
import AsyncButton from 'react-async-button';

class PasswordInformationListItem extends React.PureComponent {
  verificationTokenSent(staffMember){
    return !!(oFetch(staffMember, 'verification_sent_at') && !this.verified(staffMember));
  }

  verified(staffMember){
    return !!oFetch(staffMember, 'verified_at');
  }

  passwordStatusContent(staffMember){
    let spanContent;
    if(oFetch(staffMember, 'disabled')){
      spanContent = 'N/A'
    }else if(this.verified(staffMember)){
      spanContent = `Set at ${safeMoment.iso8601Parse(oFetch(staffMember, 'verified_at')).format(utils.humanDateFormatWithTime())}`
    } else if (this.verificationTokenSent(staffMember)){
     spanContent = `Password setup email send at ${safeMoment.iso8601Parse(oFetch(staffMember, 'verification_sent_at')).format(utils.humanDateFormatWithTime())}`
    } else {
      spanContent = "Not Set";
    }

    return <span className="boss-details__value-line">{spanContent}</span>;
  }

  tokenActionsContent(staffMember){
    if(this.verified(staffMember)){
      return null;
    }
    let spanContent;
    if (this.verificationTokenSent(staffMember)){
      spanContent = [
        <span key={0} className="boss-details__value-line">
          <AsyncButton
            className="boss-details__value-action"
            text="Revoke password setup email"
            pendingText="Revoking..."
            onClick={() => oFetch(this.props, 'onRevokePasswordSetupEmail')(staffMember)}
          />
        </span>,
        <span key={1} className="boss-details__value-line">
          <AsyncButton
            className="boss-details__value-action"
            text="Resend password setup email"
            pendingText="Resending..."
            onClick={() => oFetch(this.props, 'onResendPasswordSetupEmail')(staffMember)}
          />
        </span>
      ]
    } else {
      spanContent = <AsyncButton
        className="boss-details__value-action"
        text="Send password setup email"
        pendingText="Sending..."
        onClick={() => oFetch(this.props, 'onSendPasswordSetupEmail')(staffMember)}
      />;
    }

    return <span className="boss-details__value-line">{spanContent}</span>;
  }

  render(){
    let staffMember = this.props.staffMember;

    return <li className="boss-details__item">
      <p className="boss-details__label boss-details__label_size_small">Application Password</p>
      <p className="boss-details__value">
        { this.passwordStatusContent(staffMember) }
        { !oFetch(staffMember, 'disabled') &&
            this.tokenActionsContent(staffMember) }
      </p>
    </li>;
  }
};

export default PasswordInformationListItem;
