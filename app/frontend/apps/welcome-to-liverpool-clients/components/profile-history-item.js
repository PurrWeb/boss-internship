import React from 'react';
import PropTypes from 'prop-types';
import oFetch from 'o-fetch';
import utils from '~/lib/utils';
import safeMoment from '~/lib/safe-moment';
import humanize from 'string-humanize';

import { HISTORY_EVENT_MAP, CREATED, REGISTERED, UPDATED } from '../constants';

function renderValue(key, value) {
  if (key === 'date_of_birth') {
    return safeMoment.parse(value, 'YYYY-MM-DD').format(utils.commonDateFormat);
  }
  if (key === 'email') {
    return value;
  }

  return humanize(value);
}

function renderField(fieldName, changeset) {
  if (fieldName === 'verified_at' && changeset[fieldName][0] === null) {
    return (
      <p className="boss-timeline__text">
        <span className="boss-timeline__text-faded">Verified</span>
      </p>
    );
  }
  if (fieldName === 'card_number') {
    const isAssigned = changeset[fieldName][0] === null && changeset[fieldName][1];
    const isUnAssigned = changeset[fieldName][0] && changeset[fieldName][1] === null;
    if (isAssigned || isUnAssigned) {
      return (
        <p className="boss-timeline__text">
          <span className="boss-timeline__text-faded">Field </span>
          <span className="boss-timeline__text-marked">"{humanize(fieldName)}"</span>
          <span className="boss-timeline__text-faded"> was {isAssigned ? 'assigned to' : 'unassigned from'} </span>
          <span className="boss-timeline__text-marked">
            {changeset[fieldName] && isAssigned
              ? renderValue(fieldName, changeset[fieldName][1])
              : renderValue(fieldName, changeset[fieldName][0])}
          </span>
        </p>
      );
    }
  }
  if (fieldName === 'verification_token') {
    return (
      <p className="boss-timeline__text">
        <span className="boss-timeline__text-faded">Verification email was resend</span>
      </p>
    );
  }
  return (
    <p className="boss-timeline__text">
      <span className="boss-timeline__text-faded">Field </span>
      <span className="boss-timeline__text-marked">"{humanize(fieldName)}"</span>
      <span className="boss-timeline__text-faded"> was updated from </span>
      <span className="boss-timeline__text-marked">
        {changeset[fieldName] && renderValue(fieldName, changeset[fieldName][0])}
      </span>
      <span className="boss-timeline__text-faded"> to </span>
      <span className="boss-timeline__text-marked">
        {changeset[fieldName] && renderValue(fieldName, changeset[fieldName][1])}
      </span>
    </p>
  );
}

class ProfileHistoryItem extends React.Component {
  render() {
    const [date, event, changeset, by, to] = oFetch(this.props.historyItem, 'date', 'event', 'changeset', 'by', 'to');
    const { updated_at, ...changes } = changeset;

    if (event === CREATED) {
      return (
        <li className="boss-timeline__item boss-timeline__item_role_card">
          <div className="boss-timeline__inner boss-timeline__inner_role_card">
            <div className="boss-timeline__header boss-timeline__header_role_card">
              <h3 className="boss-timeline__title">
                <span className="boss-timeline__title-light">
                  {safeMoment.iso8601Parse(date).format(utils.humanDateFormatWithTime())}
                </span>
              </h3>
            </div>
            <div className="boss-timeline__group boss-timeline__group_role_card">
              <p className="boss-timeline__text">
                <span className="boss-timeline__text-faded">{HISTORY_EVENT_MAP[event]}</span>
              </p>
            </div>
          </div>
        </li>
      );
    }
    if (event === REGISTERED) {
      return (
        <li className="boss-timeline__item boss-timeline__item_role_card">
          <div className="boss-timeline__inner boss-timeline__inner_role_card">
            <div className="boss-timeline__header boss-timeline__header_role_card">
              <h3 className="boss-timeline__title">
                <span className="boss-timeline__title-light">
                  {safeMoment.iso8601Parse(date).format(utils.humanDateFormatWithTime())}
                </span>
              </h3>
            </div>
            <div className="boss-timeline__group boss-timeline__group_role_card">
              <p className="boss-timeline__text">
                <span className="boss-timeline__text-faded">{HISTORY_EVENT_MAP[event]}</span>
              </p>
            </div>
          </div>
        </li>
      );
    }
    if (event === UPDATED) {
      const fields = Object.keys(changes);
      return (
        <li className="boss-timeline__item boss-timeline__item_role_card">
          <div className="boss-timeline__inner boss-timeline__inner_role_card">
            <div className="boss-timeline__header boss-timeline__header_role_card">
              <h3 className="boss-timeline__title">
                <span className="boss-timeline__title-light">
                  {safeMoment.iso8601Parse(date).format(utils.humanDateFormatWithTime())}
                </span>
              </h3>
            </div>
            <div className="boss-timeline__group boss-timeline__group_role_card boss-timeline__group_marked">
              <ul className="boss-timeline__info-list">
                {fields.map(fieldName => {
                  if (fieldName === 'wtl_card_id') {
                    return null;
                  }
                  return (
                    <li key={fieldName} className="boss-timeline__info-item">
                      {renderField(fieldName, changes)}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="boss-timeline__group boss-timeline__group_role_card">
              <p className="boss-timeline__text">
                <span className="boss-timeline__text-faded">{HISTORY_EVENT_MAP[event]}</span>
                <span className="boss-timeline__text-marked">{by}</span>
              </p>
            </div>
          </div>
        </li>
      );
    }
  }
}

ProfileHistoryItem.propTypes = {
  historyItem: PropTypes.object.isRequired,
};

export default ProfileHistoryItem;
