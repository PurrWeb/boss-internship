import React, { Component } from 'react';
import Immutable from 'immutable';
import oFetch from 'o-fetch';
import LoadMoreButton from './load-more-button';

const loadMore = WrappedComponent => {
  return class LoadMore extends Component {
    constructor(props) {
      super(props);
      if (!props.list && !props[props.listObjectName]) {
        throw new Error('`list` prop or `listObjectName` prop must be present');
      }
      if (!props.perPage) {
        throw new Error('`perPage` prop must be present');
      }
      this.state = {
        reducedList: this.getReducedList(this.getList(), oFetch(this.props, 'perPage')),
        fullList: this.getList(),
      };
    }

    componentWillReceiveProps(nextProps) {
      this.setState(state => {
        const currentReducedListSize = state.reducedList.size <= this.props.perPage ? this.props.perPage : state.reducedList.size;
        const fullList = nextProps[this.getListName()];
        return {
          fullList: fullList,
          reducedList: this.getReducedList(fullList, currentReducedListSize),
        };
      });
    }

    getList() {
      return this.props.list || this.props[this.props.listObjectName];
    }

    getListName() {
      return this.props.list ? 'list' : this.props.listObjectName;
    }

    handleLoadMore = () => {
      this.setState(state => {
        const currentReducedListSize = state.reducedList.size;
        const fullList = this.getList();
        const perPage = oFetch(this.props, 'perPage');

        return {
          reducedList: this.getReducedList(fullList, currentReducedListSize + perPage),
        };
      });
    };

    getReducedList(list, amount) {
      return list.slice(0, amount);
    }

    isShowLoadMoreButton() {
      return this.state.reducedList.size < this.getList().size;
    }

    render() {
      const fullList = this.getList();
      const totalAmount = fullList.size;
      const currentAmount = this.state.reducedList.size;

      const newProps = {
        [this.getListName()]: this.state.reducedList,
      };

      return (
        <div style={{ marginBottom: '15px' }}>
          <WrappedComponent {...this.props} {...newProps} />
          {this.isShowLoadMoreButton() && (
            <LoadMoreButton onClick={this.handleLoadMore} currentAmount={currentAmount} totalAmount={totalAmount} />
          )}
        </div>
      );
    }
  };
};

export default loadMore;
