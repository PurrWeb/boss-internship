import React from 'react';
import oFetch from 'o-fetch';
import PropTypes from 'prop-types';
import ClientsFilterForm from './clients-filter-form';

class DashboardDropdownFilter extends React.PureComponent {
  handleFilterUpdate = values => {
    const onFilterUpdate = oFetch(this.props, 'onFilterUpdate');
    onFilterUpdate(values.toJS());
  };

  render() {
    const { nameFilter, emailFilter, statusFilter, cardNumberFilter } = this.props;
    const initialValues = {
      name: nameFilter,
      email: emailFilter,
      status: statusFilter,
      cardNumber: cardNumberFilter,
    };
    return (
      <div className="boss-dropdown__content boss-dropdown__content_state_opened">
        <div className="boss-dropdown__content-inner" style={{ paddingTop: '30px', marginTop: 0 }}>
          <ClientsFilterForm initialValues={initialValues} onSubmit={this.handleFilterUpdate} />
        </div>
      </div>
    );
  }
}

DashboardDropdownFilter.propTypes = {
  onFilterUpdate: PropTypes.func.isRequired,
};

export default DashboardDropdownFilter;
