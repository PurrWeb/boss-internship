import React from 'react';
import classnames from 'classnames';

import ReactPaginate from 'react-paginate';

export default class Pagination extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pageCount: this.props.totalPages,
      page: this.props.filter.page
    }
  }

  handlePageClick(page) {
    let startDate, endDate;

    this.props.setFilterParams({
      page: page.selected + 1
    });

    if (this.props.filter.startDate) {
      startDate = this.props.filter.startDate.format('DD/MM/YYYY');
    }

    if (this.props.filter.endDate) {
      endDate = this.props.filter.endDate.format('DD/MM/YYYY');
    }

    this.props.queryMaintenanceTasks({
      startDate: startDate,
      endDate: endDate,
      statuses: this.props.filter.statuses,
      priorities: this.props.filter.priorities,
      venues: this.props.filter.venues,
      page: page.selected + 1
    });
  }

  delimiterTag() {
    return (
      <a className="boss-paginator__action-link" href="javascript:;">...</a>
    );
  }

  render() {
    return(
      <div>
        <div className="boss-page-main__count boss-page-main__count_space_large">
          <span className="boss-page-main__count-text">Showing</span>
          <span className="boss-page-main__count-text boss-page-main__count-text_marked"> { this.props.maintenanceTasks.length } </span>
          <span className="boss-page-main__count-text">of</span>
          <span className="boss-page-main__count-text boss-page-main__count-text_marked"> { this.props.filter.totalCount } </span>
        </div>

        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={this.delimiterTag()}
          pageCount={this.props.filter.totalPages}
          disableInitialCallback={true}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          forcePage={this.props.filter.page - 1}
          onPageChange={this.handlePageClick.bind(this)}
          pageClassName={"boss-paginator__action"}
          breakClassName={"boss-paginator__action boss-paginator__action_role_delimiter"}
          nextClassName={"boss-paginator__action boss-paginator__action_role_next"}
          activeClassName={"boss-paginator__action boss-paginator__action_role_current boss-paginator__action_state_active"}
          disabledClassName={"boss-paginator__action_state_disabled"}
          previousClassName={"boss-paginator__action boss-paginator__action_role_prev"}
          containerClassName={"boss-paginator boss-paginator_position_last boss-paginator_context_board"}
          pageLinkClassName={"boss-paginator__action-link"}
          previousLinkClassName={"boss-paginator__action-link"}
          nextLinkClassName={"boss-paginator__action-link"}
        />
      </div>
    );
  }
}

