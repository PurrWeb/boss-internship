import React from 'react';
import oFetch from 'o-fetch';
import PropTypes from 'prop-types';
import pureToJs from '~/hocs/pure-to-js';
import AsyncButton from 'react-async-button';

class CardItem extends React.Component {
  render() {
    const [number, fullName, disabled] = oFetch(this.props.card, 'number', 'fullName', 'disabled');
    const [onEnable, onDisable] = oFetch(this.props, 'onEnable', 'onDisable');
    return (
      <div
        className={`boss-check boss-check_role_board boss-check_page_wtl-cards-index ${
          disabled ? 'boss-check_state_alert' : ''
        }`}
      >
        <div className="boss-check__header">
          <div className="boss-check__header-group">
            <div className="boss-check__header-info">
              <h3 className="boss-check__title">
                {number} {fullName && ' - '} <span className="boss-check__title-light">{fullName}</span>
              </h3>
            </div>
          </div>
          <div className="boss-check__header-actions">
            {disabled ? (
              <AsyncButton
                className="boss-button boss-button_type_small boss-button_role_enable-light boss-check__header-action"
                text="Enable"
                pendingText="Enabling ..."
                onClick={() => onEnable({ number })}
              />
            ) : (
              <AsyncButton
                className="boss-button boss-button_type_small boss-button_role_cancel-light boss-check__header-action"
                text="Disable"
                pendingText="Disabling ..."
                onClick={() => onDisable({ number })}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

CardItem.propTypes = {
  card: PropTypes.object.isRequired,
  onEnable: PropTypes.func.isRequired,
  onDisable: PropTypes.func.isRequired,
};

export default CardItem;

export const PureToJSCardItem = pureToJs(CardItem);
