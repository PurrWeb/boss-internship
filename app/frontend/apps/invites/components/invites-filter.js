import React from 'react';
import InvitesFilterForm from './invites-filter-form';

class InvitesFilter extends React.Component {
  handleSubmit = values => {
    return this.props.onFilter(values.toJS());
  };

  render() {
    return <InvitesFilterForm initialValues={this.props.initialValues} onSubmit={this.handleSubmit} />;
  }
}

export default InvitesFilter;
