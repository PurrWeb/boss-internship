import React from 'react';
import PropTypes from 'prop-types';
import SubmissionsListItem from './submissions-list-item';

class SubmissionsList extends React.Component {
  static propTypes = {
    items: PropTypes.object.isRequired,
    onDetailsClick: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
  }

  renderTableHeader() {
    return (
      <div className="boss-table__row">
        <div className="boss-table__cell boss-table__cell_role_header">Date</div>
        <div className="boss-table__cell boss-table__cell_role_header">Checklist</div>
        <div className="boss-table__cell boss-table__cell_role_header">Created By</div>
        <div className="boss-table__cell boss-table__cell_role_header">Status</div>
        <div className="boss-table__cell boss-table__cell_role_header">Action</div>
      </div>
    )
  }

  renderItems(items) {
    return items.map((item, key) => {
      return <SubmissionsListItem onDetailsClick={this.props.onDetailsClick} key={key} item={item} />
    })
  }

  renderEmptyList() {
    return (
      <h1 className="boss-table__cell boss-table__cell_role_header">No checklists found</h1>
    )
  }

  renderSubmissionsList() {
    return <div className="boss-table boss-table_page_checklist-review">
      { this.renderTableHeader() }
      { this.renderItems(this.props.items) }
    </div>
  }

  render() {
    return (
      !this.props.items.size
        ? this.renderEmptyList()
        : this.renderSubmissionsList()
    )
  }
}

export default SubmissionsList;
