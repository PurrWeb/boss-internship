import React from 'react';
import oFetch from 'o-fetch';
import safeMoment from "~/lib/safe-moment";
import utils from "~/lib/utils";

class PasswordInformationListItem extends React.PureComponent {
  verificationTokenSent(staffMember){
    !!(oFetch(staffMember, 'verification_sent_at') && !this.verified(staffMember))
  }

  verified(staffMember){
    !!oFetch(staffMember, 'verified_at')
  }

  passwordStatusContent(staffMember){
    let spanContent;
    if(this.verified(staffMember)){
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
      return;
    }

    let spanContent;
    if (this.verificationTokenSent(staffMember)){
      spanContent = [
        <a key={0} href="#" className="boss-details__value-action">Revoke token</a>,
        <a key={1} href="#" className="boss-details__value-action">Send new password setup email</a>
      ]
    } else {
      spanContent = <a href="#" className="boss-details__value-action">Send password setup email</a>;
    }

    return <span className="boss-details__value-line">{spanContent}</span>;
  }

  render(){
    let staffMember = this.props.staffMember;

    return <li className="boss-details__item">
      <p className="boss-details__label boss-details__label_size_small">Application Password</p>
      <p className="boss-details__value">
        { this.passwordStatusContent(staffMember) }
        { this.tokenActionsContent(staffMember) }
      </p>
    </li>;
  }
};

export default PasswordInformationListItem;
