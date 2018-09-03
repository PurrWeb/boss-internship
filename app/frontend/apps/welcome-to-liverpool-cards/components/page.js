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
import LoadMore from '~/components/load-more/load-more-children';
import { appRoutes } from '~/lib/routes';
import { openContentModal, openWarningModal } from '~/components/modals';

class Page extends React.Component {
  componentDidMount() {
    const filter = queryString.parse(window.location.search);
    oFetch(this.props, 'changeCardNumberFilter')({
      filter: filter.card_number ? filter.card_number : null,
    });
    document.title = 'Welcome to Liverpool Cards';
  }

  handleDropdownFilterUpdate = filter => {
    oFetch(this.props, 'changeCardNumberFilter')({ filter });
    const filterQuery = queryString.stringify({
      card_number: filter,
    });
    window.history.pushState(
      'state',
      'title',
      filter ? `${appRoutes.wtlCardsPage()}?${filterQuery}` : `${appRoutes.wtlCardsPage()}`,
    );
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
    oFetch(this.props, 'changeActiveFilter')({ filter });
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
    const [cards, total, enadleCardRequested] = oFetch(this.props, 'cards', 'total', 'enadleCardRequested');
    return (
      <main className="boss-page-main">
        <Dashboard
          total={total}
          dropdownFilter={
            <DashboardDropdownFilter
              onFilterUpdate={this.handleDropdownFilterUpdate}
              cardNumberFilter={oFetch(this.props, 'cardNumberFilter')}
            />
          }
          activeFilter={<DashboardActiveFilter onActiveFilterChange={this.handleActiveFilterChange} />}
        />
        <LoadMore items={cards}>
          {({ visibleItems, onLoadMore }) => (
            <CardList
              cards={visibleItems}
              total={cards.size}
              onLoadMore={onLoadMore}
              itemRenderer={card => (
                <PureToJSCardItem
                  card={card}
                  onEnable={enadleCardRequested}
                  onDisable={this.handleDisableCard}
                  onOpenHistory={this.handleOpenHistory}
                />
              )}
            />
          )}
        </LoadMore>
      </main>
    );
  }
}

Page.propTypes = {
  cards: PropTypes.instanceOf(Immutable.List).isRequired,
  total: PropTypes.number.isRequired,
  changeActiveFilter: PropTypes.func.isRequired,
  changeCardNumberFilter: PropTypes.func.isRequired,
  enadleCardRequested: PropTypes.func.isRequired,
  disableCardRequested: PropTypes.func.isRequired,
  cardNumberFilter: PropTypes.string,
};

export default Page;
