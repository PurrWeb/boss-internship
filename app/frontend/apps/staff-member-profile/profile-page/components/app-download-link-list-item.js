import React from 'react';
import oFetch from 'o-fetch';
import safeMoment from "~/lib/safe-moment";
import utils from "~/lib/utils"

const AppDownloadLinkListItem = (props) => {
  const appName = oFetch(props, 'appName');
  const lastSentAt = props['lastSentAt'];
  const index = oFetch(props, 'index');
  const onLinkClick = oFetch(props, 'onLinkClick');

  return <li key={index} className="boss-details__item" >
    <p className="boss-details__label">{appName}</p>
    <p className="boss-details__value">
      <span className="boss-details__value-line">
        <a onClick={onLinkClick} className="boss-details__value-action">Send download email</a>
      </span>
      { lastSentAt &&
        <span className="boss-details__value-line">
          Last sent at {safeMoment.iso8601Parse(lastSentAt).format(utils.humanDateFormatWithTime())}
        </span>
      }
    </p>
  </li>;
}

export default AppDownloadLinkListItem;
