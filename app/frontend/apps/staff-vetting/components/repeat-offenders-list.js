import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import oFetch from 'o-fetch';

class RepeatOffendersList extends Component {
  renderNoItems = () => {
    const noItemsText = oFetch(this.props, 'noItemsText');
    return (
      <div className="boss-users__flow">
        <p className="boss-users__text-placeholder">{noItemsText}</p>
      </div>
    );
  };

  renderMarkNeededList = () => {
    const items = oFetch(this.props, 'items').filter(item => item.get('markNeeded') === true);
    const itemRenderer = oFetch(this.props, 'itemRenderer');
    if (items.size === 0) {
      return null;
    }
    return (
      <div className="boss-page-main__group boss-page-main__group_adjust_staff-vetting boss-page-main__group_highlight_alert boss-page-main__group_context_stack">
        <div className="boss-users">
          <div className="boss-users__flow boss-users__flow_type_no-space">
            <h3 className="boss-users__flow-title boss-users__flow-title_role_alert">Requiring Action</h3>
            <div className="boss-users__flow-list">
              {items.map(item => {
                const jsItem = item.toJS();
                const id = oFetch(jsItem, 'id');

                return React.cloneElement(itemRenderer(jsItem), {
                  key: id,
                });
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderMarkedList = () => {
    const items = oFetch(this.props, 'items').filter(item => item.get('markNeeded') === false);
    const itemRenderer = oFetch(this.props, 'itemRenderer');
    if (items.size === 0) {
      return null;
    }
    return (
      <div className="boss-users__flow-list">
        {items.map(item => {
          const jsItem = item.toJS();
          const id = oFetch(jsItem, 'id');

          return React.cloneElement(itemRenderer(jsItem), {
            key: id,
          });
        })}
      </div>
    );
  };

  render() {
    const items = oFetch(this.props, 'items');
    const hasNoItems = items.size === 0;
    if (hasNoItems) {
      return (
        <div className="boss-users__flow">
          <div className="boss-users__flow-list">{this.renderNoItems()}</div>
        </div>
      );
    }
    return (
      <div>
        {this.renderMarkNeededList()}
        {this.renderMarkedList()}
      </div>
    );
  }
}

RepeatOffendersList.defaultProps = {
  profileLink: true,
  noItemsText: 'No Items found',
};

RepeatOffendersList.propTypes = {
  items: ImmutablePropTypes.list,
};

export default RepeatOffendersList;
