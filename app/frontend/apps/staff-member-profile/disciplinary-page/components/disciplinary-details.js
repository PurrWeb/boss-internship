import React from 'react';
import safeMoment from '~/lib/safe-moment';
import utils from '~/lib/utils';
import oFetch from 'o-fetch';

class DisciplinaryDetails extends React.Component {
  render() {
    const [staffMemberFullName, companyName, currentUserFullName, appealToName] = oFetch(
      this.props,
      'staffMemberFullName',
      'companyName',
      'currentUserFullName',
      'appealToName',
    );
    const [nature, conduct, consequence, title, levelText, levelExpiration, expiredAt, createdAt] = oFetch(
      this.props.disciplinary,
      'nature',
      'conduct',
      'consequence',
      'title',
      'levelText',
      'levelExpiration',
      'expiredAt',
      'createdAt',
    );
    const formattedCreatedAt = safeMoment.iso8601Parse(createdAt).format(utils.timeWithFullDayAndMonthFormat);
    return (
      <div className="boss-modal-window__overview">
        <div className="boss-overview boss-overview_page_smp-disciplinary-details">
          <h3 className="boss-overview__title">{companyName}</h3>
          <p className="boss-overview__subtitle">
            {'Notice of '}{' '}
            <span className="boss-overview__subtitle-marked">
              {levelText} ({levelExpiration})
            </span>
          </p>
          <div className="boss-overview__group">
            <p className="boss-overview__text">
              <span className="boss-overview__text-line">
                Dear <span className="boss-overview__text-marked boss-overview__text-large">{staffMemberFullName}</span>
              </span>

              <span className="boss-overview__text-line">
                You attend a disciplinary hearing on{' '}
                <span className="boss-overview__text-marked boss-overview__text-large">{formattedCreatedAt}</span>
                , and I am writing to inform you of your{' '}
                <span className="boss-overview__text-marked boss-overview__text-large">{title}</span>
                . This warning will be placed in your personal file but will be disregarded for disciplinary purposes
                after a period of{' '}
                <span className="boss-overview__text-marked boss-overview__text-large">{levelExpiration}</span>
                , provided your conduct improves.
              </span>
            </p>
          </div>
          <div className="boss-overview__group">
            <h4 className="boss-overview__label">
              <span className="boss-overview__label-text">
                a) The nature of the unsatisfactory conduct or performance was
              </span>
            </h4>
            <p className="boss-overview__text">{nature}</p>
          </div>
          <div className="boss-overview__group">
            <h4 className="boss-overview__label">
              <span className="boss-overview__label-text">b) The conduct or performance improvement expected is</span>
            </h4>
            <p className="boss-overview__text">{conduct}</p>
          </div>
          <div className="boss-overview__group">
            <h4 className="boss-overview__label">
              <span className="boss-overview__label-text">
                c) The likely consequence of further misconduct or insufficient improvement is
              </span>
            </h4>
            <p className="boss-overview__text">{consequence}</p>
          </div>
          <div className="boss-overview__group">
            <p className="boss-overview__text">
              <span className="boss-overview__text-line">
                You have the right of appeal against this decision to&nbsp;
                <span className="boss-overview__text-marked boss-overview__text-large">{appealToName}</span>
                &nbsp;within 7 days of receiving this disciplinary decision.
              </span>
            </p>
          </div>
          <div className="boss-form__group">
            <div className="boss-form__text">
              <div className="boss-form__text-line">
                {currentUserFullName} (on behalf of {companyName})
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default DisciplinaryDetails;
