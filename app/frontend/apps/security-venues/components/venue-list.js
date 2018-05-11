import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import oFetch from 'o-fetch';
import loadMore from '~/components/load-more';

class VenueList extends Component {
  renderItems(venues) {
    const itemRenderer = oFetch(this.props, 'itemRenderer');
    return venues.map(venue => React.cloneElement(itemRenderer(venue), { key: oFetch(venue, 'id') }));
  }

  render() {
    const venues = oFetch(this.props, 'venues');
    return (
      <div className="boss-page-main__content">
        <div className="boss-page-main__inner">{this.renderItems(venues)}</div>
      </div>
    );
  }
}

VenueList.propTypes = {
  venues: ImmutablePropTypes.list.isRequired,
};

export default loadMore(VenueList);
