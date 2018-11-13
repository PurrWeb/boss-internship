import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import oFetch from 'o-fetch';
import Immutable from 'immutable';
import Spinner from '~/components/spinner';
import Dashboard from './dashboard';
import queryString from 'query-string';
import ClientList from './client-list';
import { PureToJSClientItem } from './client-item';
import { PureToJSClientItemMobile } from './client-item-mobile';
import DashboardDropdownFilter from './dashboard-dropdown-filter';

class ClientsPage extends React.Component {
  state = {
    fetching: true,
  };

  componentDidMount = async () => {
    const filterQuery = queryString.parse(this.props.location.search);
    const filter = {
      name: filterQuery.name ? filterQuery.name : null,
      email: filterQuery.email ? filterQuery.email : null,
      status: filterQuery.status ? filterQuery.status : null,
      cardNumber: filterQuery.card_number ? filterQuery.card_number : null,
    };
    oFetch(this.props, 'changeFilter')(filter);
    document.title = 'Welcome to Liverpool Clients';
    if (this.props.clients.size === 0) {
      await this.props.getWtlClients(filter);
    }
    this.setState({ fetching: false });
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
    return this.props.filterWtlClients(filter);
  };

  onLoadMore = () => {
    const filterQuery = queryString.parse(this.props.location.search);
    const filter = {
      name: filterQuery.name ? filterQuery.name : null,
      email: filterQuery.email ? filterQuery.email : null,
      status: filterQuery.status ? filterQuery.status : null,
      cardNumber: filterQuery.card_number ? filterQuery.card_number : null,
    };
    return this.props.loadMore(filter);
  };

  goToProfile = id => {
    this.props.loadWtlClient({ client: null });
    this.props.history.push(`/profile/${id}`);
  };

  render() {
    if (this.state.fetching) {
      return <Spinner />;
    }
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
          onLoadMore={this.onLoadMore}
          itemRenderer={client => (
            <PureToJSClientItem
              onResendVerificationEmailClick={this.props.resendWtlClientVerificationEmailAction}
              client={client}
              onGoToProfile={this.goToProfile}
            />
          )}
          itemRendererMobile={client => (
            <PureToJSClientItemMobile
              onResendVerificationEmailClick={this.props.resendWtlClientVerificationEmailAction}
              client={client}
              onGoToProfile={this.goToProfile}
            />
          )}
        />
      </main>
    );
  }
}

ClientsPage.propTypes = {
  clients: PropTypes.instanceOf(Immutable.List).isRequired,
  perPage: PropTypes.number.isRequired,
  pageNumber: PropTypes.number.isRequired,
  changeFilter: PropTypes.func.isRequired,
  loadMore: PropTypes.func.isRequired,
  getWtlClients: PropTypes.func.isRequired,
  loadWtlClient: PropTypes.func.isRequired,
  resendWtlClientVerificationEmailAction: PropTypes.func.isRequired,
};

export default withRouter(ClientsPage);
