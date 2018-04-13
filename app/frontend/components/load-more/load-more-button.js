import React, { Component } from 'react';
import oFetch from 'o-fetch';

class LoadMoreButton extends Component {
  render() {
    const currentAmount = oFetch(this.props, 'currentAmount');
    const totalAmount = oFetch(this.props, 'totalAmount');

    const onClick = oFetch(this.props, 'onClick');

    return (
      <div>
        <div className="boss-page-main__count boss-page-main__count_space_large">
          <span className="boss-page-main__count-text">Showing&nbsp;</span>
          <span className="boss-page-main__count-text boss-page-main__count-text_marked">{currentAmount}</span>
          <span className="boss-page-main__count-text">&nbsp;of&nbsp;</span>
          <span className="boss-page-main__count-text boss-page-main__count-text_marked">{totalAmount}</span>
        </div>
        <div className="boss-page-main__actions boss-page-main__actions_position_last">
          <button onClick={onClick} className="boss-button boss-button_role_load-more boss-button_adjust_full-mobile">Load More</button>
        </div>
      </div>
    );
  }
}

export default LoadMoreButton;
