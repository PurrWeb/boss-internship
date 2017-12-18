import React from 'react';
import PropTypes from 'prop-types';
import BossCheckCardActions from './boss-check-card-actions';
import BossCheckCardRow from './boss-check-card-row';

class BossCheckCard extends React.PureComponent {
  renderChildrens() {
    return React.Children.map(this.props.children, (child, i) => {
      if (child.type === BossCheckCardActions) {
        this.actionsButtons = child;
      };
      if (child.type === BossCheckCardRow) {
        return React.cloneElement(child, {
          key: `${i}`
        });
      }
      return;
    })
  }

  render() {
    return (
      <div className="boss-check boss-check_role_board">
        <div className="boss-check__row">
          <div className="boss-check__cell">
            <p className={`boss-check__title ${this.props.className}`}>
              {this.props.title}
              {!!this.props.status && <span className="boss-check__title-status">{this.props.status}</span>}
            </p>
          </div>
        </div>
        <div className="boss-check__row boss-check__row_marked">
          <div className="boss-check__info-table">
            {this.renderChildrens()}
          </div>
        </div>
        {this.actionsButtons}
      </div>
    )
  }
}

BossCheckCard.propTypes = {
  title: PropTypes.string.isRequired,
  status: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.array.isRequired
}

BossCheckCard.defaultProps = {
  className: '',
  status: ''
}

export default BossCheckCard;
