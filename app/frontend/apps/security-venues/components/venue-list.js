import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import oFetch from 'o-fetch';

class VenueList extends Component {
  renderItems(venues) {
    const itemRenderer = oFetch(this.props, 'itemRenderer');
    return venues.map(venue => React.cloneElement(itemRenderer(venue), { key: venue.id }));
  }

  render() {
    const venues = oFetch(this.props, 'venues');
    const total = oFetch(this.props, 'total');
    const showing = venues.size;
    return (
      <div className="boss-page-main__content">
        <div className="boss-page-main__inner">{this.renderItems(venues)}</div>
        <div className="boss-page-main__count boss-page-main__count_space_large">
          <span className="boss-page-main__count-text">Showing</span>
          <span className="boss-page-main__count-text boss-page-main__count-text_marked">{` ${showing} `}</span>
          <span className="boss-page-main__count-text">of</span>
          <span className="boss-page-main__count-text boss-page-main__count-text_marked">{` ${total} `}</span>
        </div>
        {showing !== total && (
          <div className="boss-page-main__actions boss-page-main__actions_position_last">
            <button className="boss-button boss-button_role_load-more boss-button_adjust_full-mobile">Load More</button>
          </div>
        )}
      </div>
    );
  }
}

VenueList.propTypes = {
  venues: ImmutablePropTypes.list.isRequired,
  total: PropTypes.number.isRequired,
};

export default VenueList;
