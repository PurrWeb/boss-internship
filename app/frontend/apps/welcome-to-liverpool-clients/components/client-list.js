import React from 'react';
import oFetch from 'o-fetch';
import Immutable from 'immutable';
import PropTypes from 'prop-types';

class ClientList extends React.Component {
  renderItems(clients) {
    const itemRenderer = oFetch(this.props, 'itemRenderer');
    return clients.map(client =>
      React.cloneElement(itemRenderer(client), {
        key: client.get('id'),
      }),
    );
  }

  renderMobileItems(clients) {
    const itemRendererMobile = oFetch(this.props, 'itemRendererMobile');
    return clients.map(client =>
      React.cloneElement(itemRendererMobile(client), {
        key: client.get('id'),
      }),
    );
  }

  render() {
    const [clients, onLoadMore, total] = oFetch(this.props, 'clients', 'onLoadMore', 'total');

    return (
      <div className="boss-page-main__content">
        <div className="boss-page-main__inner">
          <div className="boss-page-main__group boss-page-main__group_adjust_wtl-clients-table">
            <div className="boss-table boss-table_page_wtl-clients-index">
              <div className="boss-table__row boss-table__row_role_header">
                <div className="boss-table__cell boss-table__cell_role_header">Name</div>
                <div className="boss-table__cell boss-table__cell_role_header">Status</div>
                <div className="boss-table__cell boss-table__cell_role_header">Card number</div>
                <div className="boss-table__cell boss-table__cell_role_header" />
              </div>
              {this.renderItems(clients)}
            </div>
            {this.renderMobileItems(clients)}
          </div>
          <div className="boss-page-main__count boss-page-main__count_space_large">
            <span className="boss-page-main__count-text">Showing&nbsp;</span>
            <span className="boss-page-main__count-text boss-page-main__count-text_marked">{clients.size}</span>
            <span className="boss-page-main__count-text">&nbsp;of&nbsp;</span>
            <span className="boss-page-main__count-text boss-page-main__count-text_marked">{total}</span>
          </div>
          {clients.size !== total && (
            <div className="boss-page-main__actions boss-page-main__actions_position_last">
              <button
                onClick={onLoadMore}
                className="boss-button boss-button_role_load-more boss-button_adjust_full-mobile"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

ClientList.propTypes = {
  clients: PropTypes.instanceOf(Immutable.List).isRequired,
  total: PropTypes.number.isRequired,
  onLoadMore: PropTypes.func.isRequired,
  itemRenderer: PropTypes.func.isRequired,
  itemRendererMobile: PropTypes.func.isRequired,
};

export default ClientList;
