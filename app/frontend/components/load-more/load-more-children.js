import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import oFetch from 'o-fetch';

class LoadMore extends React.PureComponent {
  state = {
    count: 1,
  };

  handleLoadMore = () => {
    const [items, perPage] = oFetch(this.props, 'items', 'perPage');

    const newCount = this.state.count + 1;
    if (newCount * perPage > items.size + perPage) return;

    this.setState({
      count: newCount,
    });
  };

  handleReset = () => {
    this.setState({
      count: 1,
    });
  };

  render() {
    const [items, children, perPage] = oFetch(this.props, 'items', 'children', 'perPage');
    const count = oFetch(this.state, 'count');
    return children({
      visibleItems: items.slice(0, count * perPage),
      onLoadMore: this.handleLoadMore,
      onReset: this.handleReset,
    });
  }
}

LoadMore.propTypes = {
  items: PropTypes.oneOfType([PropTypes.array, PropTypes.instanceOf(Immutable.List)]).isRequired,
  children: PropTypes.func.isRequired,
  perPage: PropTypes.number.isRequired,
};

LoadMore.defaultProps = {
  perPage: 5,
};

export default LoadMore;
