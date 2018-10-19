import React from 'react';
import PropTypes from 'prop-types';

export default function RotaFilter({ currentRotaDay, page = 'daily', securityShiftRequestsCount }) {
  return (
    <div className="boss-form__field boss-form__field_role_control boss-form__field_layout_min">
      <p className="boss-form__label boss-form__label_type_icon-single boss-form__label_type_icon-date">
        <span className="boss-form__label-text boss-form__label-text_type_hidden">
          Display
        </span>
      </p>
      <div className="boss-form__switcher">
        {page === 'daily' ? (
          <span className="boss-form__switcher-label">
            <span className="boss-form__switcher-label-text boss-form__switcher-label-text_type_border boss-form__switcher-label-text_state_active">
              Daily
            </span>
          </span>
        ) : (
          <a
            href={`/security_rotas/${currentRotaDay}`}
            className="boss-form__switcher-label"
          >
            <span className="boss-form__switcher-label-text boss-form__switcher-label-text_type_border">
              Daily
            </span>
          </a>
        )}
        {page === 'weekly' ? (
          <span className="boss-form__switcher-label">
            <span className="boss-form__switcher-label-text boss-form__switcher-label-text_type_border boss-form__switcher-label-text_state_active">
              Weekly
            </span>
          </span>
        ) : (
          <a
            href={`/security_rotas?highlight_date=${currentRotaDay}`}
            className="boss-form__switcher-label"
          >
            <span className="boss-form__switcher-label-text boss-form__switcher-label-text_type_border">
              Weekly
            </span>
          </a>
        )}
        {page === 'requests' ? (
          <span className="boss-form__switcher-label">
            <span className="boss-form__switcher-label-text boss-form__switcher-label-text_type_border boss-form__switcher-label-text_state_active">
              Requests {securityShiftRequestsCount !== undefined && <b>{securityShiftRequestsCount}</b>}
            </span>
          </span>
        ) : (
          <a
            href={`/security_rotas/${currentRotaDay}/requests`}
            className="boss-form__switcher-label"
          >
            <span className="boss-form__switcher-label-text boss-form__switcher-label-text_type_border">
              Requests {securityShiftRequestsCount !== undefined && <b>{securityShiftRequestsCount}</b>}
            </span>
          </a>
        )}
      </div>
    </div>
  );
}

RotaFilter.propTypes = {
  currentRotaDay: PropTypes.string.isRequired,
  page: PropTypes.oneOf(['daily', 'weekly', 'requests']),
};
