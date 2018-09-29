import React from 'react';
import oFetch from 'o-fetch';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import AsyncButton from 'react-async-button';

class CardList extends React.Component {
  renderItems(cards) {
    const itemRenderer = oFetch(this.props, 'itemRenderer');
    return cards.map(card =>
      React.cloneElement(itemRenderer(card), {
        key: card.get('number'),
      }),
    );
  }
  render() {
    const [cards, onLoadMore, total] = oFetch(this.props, 'cards', 'onLoadMore', 'total');
    if (cards.size === 0) {
      return (
        <div className="boss-page-main__content">
          <div className="boss-page-main__inner">
            <div className="boss-check  boss-check_role_board boss-check_page_wtl-cards-index">
              <div className="boss-check__header">
                <div className="boss-page-main__text-placeholder">There are no cards to show.</div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="boss-page-main__content">
        <div className="boss-page-main__inner">
          {this.renderItems(cards)}
          <div className="boss-page-main__count boss-page-main__count_space_large">
            <span className="boss-page-main__count-text">Showing&nbsp;</span>
            <span className="boss-page-main__count-text boss-page-main__count-text_marked">{cards.size}</span>
            <span className="boss-page-main__count-text">&nbsp;of&nbsp;</span>
            <span className="boss-page-main__count-text boss-page-main__count-text_marked">{total}</span>
          </div>
          {cards.size !== total && (
            <div className="boss-page-main__actions boss-page-main__actions_position_last">
              <AsyncButton
                className="boss-button boss-button_role_load-more boss-button_adjust_full-mobile"
                text="Load more"
                pendingText="Loading ..."
                onClick={onLoadMore}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

CardList.propTypes = {
  cards: PropTypes.instanceOf(Immutable.List).isRequired,
  total: PropTypes.number.isRequired,
  onLoadMore: PropTypes.func.isRequired,
};

export default CardList;
