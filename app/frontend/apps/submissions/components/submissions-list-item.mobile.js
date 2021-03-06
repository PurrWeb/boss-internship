import React from 'react';
import PropTypes from 'prop-types';
import safeMoment from "~/lib/safe-moment";
import utils from "~/lib/utils"

export const CardRow = ({children, title}) => {

  return (
    <div className="boss-check__row">
      <div className="boss-check__cell">
        {children}
      </div>
    </div>
  )
}

const SubmissionsListItemMobile = ({item, onDetailsClick}) => {
  const getSubmissionStatus = (answers) => {
    return answers.filter(item => item.get('answer')).size === answers.size;
  }

  const status = getSubmissionStatus(item.get('answers'));
  const statusCn = status ? 'boss-button_role_secondary' : 'boss-button_role_alert';
  const statusText = status ? 'OK' : 'Problem'

  return (
    <div className="boss-check boss-check_role_board boss-check_page_checklist-review">
      <CardRow>
        <h3 className="boss-check__title">
          {item.get('check_list_name')}
        </h3>
      </CardRow>
      <CardRow>
        <div className="boss-check__text boss-check__text_role_date">
          <span className="boss-check__link">
            {safeMoment.iso8601Parse(item.get('created_at')).format(utils.humanDateFormatWithTime("short"))}
          </span>
        </div>
      </CardRow>
      <CardRow>
        <p className="boss-check__text boss-check__text_role_user">
          <span className="boss-check__link">
            {item.get('creator_name')}
          </span>
        </p>
      </CardRow>
      <CardRow>
        <span className={`boss-button boss-button_type_small boss-button_type_no-behavior ${statusCn}`}>
          {statusText}
        </span>
      </CardRow>
      <CardRow>
        <button className="boss-button boss-button_primary boss-table__action"
          onClick={onDetailsClick.bind(null, item)}
        >View Details</button>
      </CardRow>
    </div>
  )
}

export default SubmissionsListItemMobile;
