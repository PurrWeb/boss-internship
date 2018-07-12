import React from 'react';
import PropTypes from 'prop-types';
import BossCheckCardActions from './boss-check-card-actions';
import BossCheckRow from './boss-check-row';
import BossCheckSimpleRow from './boss-check-simple-row';
import BossCheckCardRow from './boss-check-card-row';
import BossCheckCardCollapsibleGroup from './boss-check-card-collapsible-group';

class BossCheckCard extends React.PureComponent {
  constructor(props) {
    super(props);

    this.children = [];
    this.actionsButtons = null;
    this.checkRows = [];
  }

  prepareChildren() {
    let children = [];
    let checkRows = [];
    let actionsButtons = null;
    let simpleRow = null;

    React.Children.forEach(this.props.children, (child, i) => {
      if (child.type === BossCheckCardActions) {
        actionsButtons = child;
      };
      if (child.type === BossCheckCardRow) {
        children = [...children, React.cloneElement(child, {
          key: `cardRow${i}`
        })];
      }
      if (child.type === BossCheckRow) {
        checkRows = [...checkRows, React.cloneElement(child, {
          key: `row${i}`
        })];
      }
      if (child.type === BossCheckSimpleRow) {
        simpleRow = child;
      }
      if (child.type === BossCheckCardCollapsibleGroup) {
        children = [...children, React.cloneElement(child, {
          key: `collapsibleGroup${i}`
        })];
      }
    });

    return {children, checkRows, actionsButtons, simpleRow};
  }

  render() {
    const {children, checkRows, actionsButtons, simpleRow} = this.prepareChildren();
    return (
      <div className="boss-check boss-check_role_board">
        <BossCheckRow
          className={`boss-check__title ${this.props.className}`}
          title={this.props.title}
          status={this.props.status}
        />
        { checkRows }
        <div className="boss-check__row boss-check__row_marked">
          <div className="boss-check__info-table">
            { children }
          </div>
        </div>
        { simpleRow }
        { actionsButtons }
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
