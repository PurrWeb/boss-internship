import React, { Component } from 'react';
import URLSearchParams from 'url-search-params';
import { getInitialFilterData } from './utils';

import OpsDiariesFilterForm from './ops-diaries-filter-form';

class OpsDiariesFilter extends Component {
  render() {
    const initialValues = getInitialFilterData();
    return (
      <OpsDiariesFilterForm
        venues={this.props.venues}
        initialValues={initialValues}
        onSubmit={this.props.onFilter}
      />
    );
  }
}

export default OpsDiariesFilter;
