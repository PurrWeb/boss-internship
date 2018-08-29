import React from 'react';
import oFetch from 'o-fetch';
import Immutable from 'immutable';
import PropTypes from 'prop-types';

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

CardList.propTypes = {
  cards: PropTypes.instanceOf(Immutable.List).isRequired,
  total: PropTypes.number.isRequired,
  onLoadMore: PropTypes.func.isRequired,
};

export default CardList;
