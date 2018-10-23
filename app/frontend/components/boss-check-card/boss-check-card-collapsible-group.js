import React from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'react-collapse';

class BossCheckCardCollapsibleGroup extends React.PureComponent {
  state = {
    isOpened: false,
  };

  toggleDropDown = () => {
    this.setState(state => ({ isOpened: !state.isOpened }));
  };

  render() {
    return (
      <div className="boss-check__info-group">
        <div className="boss-check__info-row boss-check__info-row_role_action">
          <div className="boss-check__info-cell">
            <p className="boss-check__text boss-check__text_role_primary">{this.props.title}</p>
          </div>
          <div className="boss-check__info-cell">
            <p
              onClick={this.toggleDropDown}
              className={`boss-check__dropdown-link ${
                this.props.showCaret
                  ? this.state.isOpened ? '' : 'boss-check__dropdown-link_state_closed'
                  : 'boss-check__dropdown-link_state_inactive'
              }`}
            >
              {this.props.text}
            </p>
          </div>
        </div>
        <Collapse isOpened={this.state.isOpened} className="boss-check__dropdown" style={{ display: 'block' }}>
          {this.props.children}
        </Collapse>
      </div>
    );
  }
}

BossCheckCardCollapsibleGroup.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  className: PropTypes.string,
};

BossCheckCardCollapsibleGroup.defaultProps = {
  className: '',
  showCaret: true,
};

export default BossCheckCardCollapsibleGroup;
