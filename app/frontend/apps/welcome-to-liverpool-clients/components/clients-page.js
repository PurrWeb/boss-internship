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

class ClientsPage extends React.Component {
  componentDidMount = async () => {
    const filter = queryString.parse(this.props.location.search);
    oFetch(this.props, 'changeFilter')({
      name: filter.name ? filter.name : null,
      email: filter.email ? filter.email : null,
      status: filter.status ? filter.status : null,
      cardNumber: filter.card_number ? filter.card_number : null,
    });
    document.title = 'Welcome to Liverpool Clients';
  };

  handleDropdownFilterUpdate = filter => {
    const changeFilter = oFetch(this.props, 'changeFilter');
    changeFilter(filter);
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
    const [
      clients,
      totalCount,
      totalPages,
      perPage,
      pageNumber,
      nameFilter,
      emailFilter,
      statusFilter,
      cardNumberFilter,
    ] = oFetch(
      this.props,
      'clients',
      'totalCount',
      'totalPages',
      'perPage',
      'pageNumber',
      'nameFilter',
      'emailFilter',
      'statusFilter',
      'cardNumberFilter',
    );
    const filter = { nameFilter, emailFilter, statusFilter, cardNumberFilter };
    return (
      <main className="boss-page-main">
        <Dashboard
          total={totalCount}
          dropdownFilter={<DashboardDropdownFilter {...filter} onFilterUpdate={this.handleDropdownFilterUpdate} />}
        />
        <ClientList
          clients={clients}
          total={totalCount}
          onLoadMore={this.props.loadMore}
          itemRenderer={client => <PureToJSClientItem client={client} />}
          itemRendererMobile={client => <PureToJSClientItemMobile client={client} />}
        />
      </main>
    );
  }
}

ClientsPage.propTypes = {
  clients: PropTypes.instanceOf(Immutable.List).isRequired,
  totalCount: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  pageNumber: PropTypes.number.isRequired,
  changeFilter: PropTypes.func.isRequired,
  loadMore: PropTypes.func.isRequired,
};

export default withRouter(ClientsPage);
