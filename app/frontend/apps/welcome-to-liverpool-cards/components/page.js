import React from 'react';
import PropTypes from 'prop-types';
import oFetch from 'o-fetch';
import Immutable from 'immutable';
import queryString from 'query-string';
import Dashboard from './dashboard';
import CardList from './card-list';
import { PureToJSCardItem } from './card-item';
import DashboardDropdownFilter from './dashboard-dropdown-filter';
import DashboardActiveFilter from './dashboard-active-filter';
import CardHistoryContent from './card-history-content';
import { appRoutes } from '~/lib/routes';
import { openContentModal, openWarningModal } from '~/components/modals';
import { ALL } from '../constants';

class Page extends React.Component {
  componentDidMount() {
    const filter = queryString.parse(window.location.search);
    oFetch(this.props, 'changeCardNumberFilter')({
      filter: filter.card_number || null,
    });
    oFetch(this.props, 'changeActiveFilter')({
      filter: filter.status || ALL,
    });
    document.title = 'Welcome to Liverpool Cards';
  }

  handleDropdownFilterUpdate = filter => {
    oFetch(this.props, 'changeCardNumberFilter')({
      filter: filter,
    });
    const parsedQueryString = queryString.parse(location.search);
    const filterQuery = queryString.stringify({
      ...parsedQueryString,
      card_number: filter,
    });
    window.history.pushState(
      'state',
      'title',
      filter ? `${appRoutes.wtlCardsPage()}?${filterQuery}` : `${appRoutes.wtlCardsPage()}`,
    );
    return this.props.getWtlCardsData({ ...parsedQueryString, card_number: filter });
  };

  handleOpenHistory = card => {
    openContentModal({
      config: {
        title: (
          <span>
            <span className="boss-modal-window__marked">{oFetch(card, 'number')}</span>&nbsp;History
          </span>
        ),
      },
      props: { card },
    })(CardHistoryContent);
  };

  handleActiveFilterChange = filter => {
    oFetch(this.props, 'changeActiveFilter')({
      filter: filter,
    });
    const parsedQueryString = queryString.parse(location.search);
    const filterQuery = queryString.stringify({
      ...parsedQueryString,
      status: filter,
    });
    window.history.pushState(
      'state',
      'title',
      filter ? `${appRoutes.wtlCardsPage()}?${filterQuery}` : `${appRoutes.wtlCardsPage()}`,
    );
    return this.props.getWtlCardsData({ ...parsedQueryString, status: filter });
  };

  handleDisableCard = ({ number }) => {
    const disableCardRequested = oFetch(this.props, 'disableCardRequested');
    openWarningModal({
      submit: hideModal => disableCardRequested({ number }).then(hideModal),
      config: {
        title: 'WARNING !!!',
        text: 'Are You Sure?',
        buttonText: 'Disable',
      },
    });
  };

  render() {
    const [cards, enadleCardRequested, totalCount, loadMore] = oFetch(
      this.props,
      'cards',
      'enadleCardRequested',
      'totalCount',
      'loadMore',
    );
    return (
      <main className="boss-page-main">
        <Dashboard
          total={totalCount}
          dropdownFilter={
            <DashboardDropdownFilter
              onFilterUpdate={this.handleDropdownFilterUpdate}
              cardNumberFilter={oFetch(this.props, 'cardNumberFilter')}
            />
          }
          activeFilter={
            <DashboardActiveFilter
              activeFilter={this.props.activeFilter}
              onActiveFilterChange={this.handleActiveFilterChange}
            />
          }
        />

        <CardList
          cards={cards}
          total={totalCount}
          onLoadMore={loadMore}
          itemRenderer={card => (
            <PureToJSCardItem
              card={card}
              onEnable={enadleCardRequested}
              onDisable={this.handleDisableCard}
              onOpenHistory={this.handleOpenHistory}
            />
          )}
        />
      </main>
    );
  }
}

Page.propTypes = {
  cards: PropTypes.instanceOf(Immutable.List).isRequired,
  changeActiveFilter: PropTypes.func.isRequired,
  changeCardNumberFilter: PropTypes.func.isRequired,
  enadleCardRequested: PropTypes.func.isRequired,
  disableCardRequested: PropTypes.func.isRequired,
  cardNumberFilter: PropTypes.string,
};

export default Page;
