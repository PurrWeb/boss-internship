import React from 'react';
import PropTypes from 'prop-types';
import oFetch from 'o-fetch';
import utils from '~/lib/utils';
import safeMoment from '~/lib/safe-moment';

class ProfileHistoryItem extends React.Component {
  render() {
    const [date, fields, updatedBy] = oFetch(this.props.historyItem, 'date', 'fields', 'updatedBy');
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
              {fields.map(field => {
                const [fieldName, prevValue, value] = oFetch(field, 'fieldName', 'prevValue', 'value');
                return (
                  <li key={fieldName} className="boss-timeline__info-item">
                    <p className="boss-timeline__text">
                      <span className="boss-timeline__text-faded">Field </span>
                      <span className="boss-timeline__text-marked">"{fieldName}"</span>
                      <span className="boss-timeline__text-faded"> was updated from </span>
                      <span className="boss-timeline__text-marked">{prevValue}</span>
                      <span className="boss-timeline__text-faded"> to </span>
                      <span className="boss-timeline__text-marked">{value}</span>
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="boss-timeline__group boss-timeline__group_role_card">
            <p className="boss-timeline__text">
              <span className="boss-timeline__text-faded">Updated by </span>
              <span className="boss-timeline__text-marked">{updatedBy}</span>
            </p>
          </div>
        </div>
      </li>
    );
  }
}

ProfileHistoryItem.propTypes = {
  historyItem: PropTypes.object.isRequired,
};

export default ProfileHistoryItem;
