import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import oFetch from 'o-fetch';
import Immutable from 'immutable';
import Dashboard from './dashboard';
import queryString from 'query-string';
import ClientList from './client-list';
import { PureToJSClientItem } from './client-item';
import { PureToJSClientItemMobile } from './client-item-mobile';
import DashboardDropdownFilter from './dashboard-dropdown-filter';
import LoadMore from '~/components/load-more/load-more-children';

class ClientsPage extends React.Component {
  componentDidMount() {
    const filter = queryString.parse(this.props.location.search);
    oFetch(this.props, 'changeFilter')({
      name: filter.name ? filter.name : null,
      email: filter.email ? filter.email : null,
      status: filter.status ? filter.status : null,
      cardNumber: filter.card_number ? filter.card_number : null,
    });
    document.title = 'Welcome to Liverpool Clients';
  }

  handleDropdownFilterUpdate = filter => {
    oFetch(this.props, 'changeFilter')(filter);
    const filterQuery = queryString.stringify({
      name: filter.name ? filter.name : undefined,
      email: filter.email ? filter.email : undefined,
      status: filter.status ? filter.status : undefined,
      card_number: filter.cardNumber ? filter.cardNumber : undefined,
    });
    this.props.history.replace({
      pathname: `/`,
      search: `?${filterQuery}`,
    });
  };

  render() {
    const [clients, total, nameFilter, emailFilter, statusFilter, cardNumberFilter] = oFetch(
      this.props,
      'clients',
      'total',
      'nameFilter',
      'emailFilter',
      'statusFilter',
      'cardNumberFilter',
    );
    const filter = { nameFilter, emailFilter, statusFilter, cardNumberFilter };
    return (
      <main className="boss-page-main">
        <Dashboard
          total={total}
          dropdownFilter={<DashboardDropdownFilter {...filter} onFilterUpdate={this.handleDropdownFilterUpdate} />}
        />
        <LoadMore items={clients}>
          {({ visibleItems, onLoadMore }) => (
            <ClientList
              clients={visibleItems}
              total={clients.size}
              onLoadMore={onLoadMore}
              itemRenderer={client => <PureToJSClientItem client={client} />}
              itemRendererMobile={client => <PureToJSClientItemMobile client={client} />}
            />
          )}
        </LoadMore>
      </main>
    );
  }
}

ClientsPage.propTypes = {
  clients: PropTypes.instanceOf(Immutable.List).isRequired,
  total: PropTypes.number.isRequired,
  changeFilter: PropTypes.func.isRequired,
};

export default withRouter(ClientsPage);
