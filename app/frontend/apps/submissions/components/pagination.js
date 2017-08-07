import React from 'react';
import ReactPaginate from 'react-paginate';
import PropTypes from 'prop-types';

const Pagination = ({pageCount, initialPage, onPageChange}) => {

  const handlePageClick = (data) => {
    let selected = data.selected + 1;
    onPageChange(selected);
  }

  return (
    <ReactPaginate
      previousLabel={"Previous"}
      nextLabel={"Next"}
      breakLabel={<a href="javascript:;">...</a>}
      pageCount={pageCount}
      forcePage={initialPage - 1}
      disableInitialCallback={true}
      marginPagesDisplayed={2}
      pageRangeDisplayed={5}
      onPageChange={handlePageClick}
      pageClassName={"boss-paginator__action"}
      breakClassName={"boss-paginator__action boss-paginator__action_role_delimiter"}
      nextClassName={"boss-paginator__action boss-paginator__action_role_next"}
      activeClassName={"boss-paginator__action_role_current boss-paginator__action_state_active"}
      disabledClassName={"boss-paginator__action_state_disabled"}
      previousClassName={"boss-paginator__action boss-paginator__action_role_prev"}
      containerClassName={"boss-paginator boss-paginator_position_last"}
    />
  )
}

export default Pagination;
