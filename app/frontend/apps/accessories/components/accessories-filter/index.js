import React from 'react';
import PropTypes from 'prop-types';
import URLSearchParams from 'url-search-params';

import AccessoriesFilterForm from './accessories-filter-form';

class AccessoriesFilter extends React.Component {

  handleSubmit = (values) => {
    return this.props.onFilter(values.toJS());
  }

  render() {
    const queryString = new URLSearchParams(window.location.search);
    const initialValues = {
      accessoryType: queryString.get('accessoryType'),
      status: queryString.get('status'),
      name: queryString.get('name'),
      userRequestable: queryString.get('userRequestable'),
    }

    return (
      <AccessoriesFilterForm initialValues={initialValues} onSubmit={this.handleSubmit} />
    )
  }
}

AccessoriesFilter.propTypes = {
}

AccessoriesFilter.defaultProps = {
}

export default AccessoriesFilter;
