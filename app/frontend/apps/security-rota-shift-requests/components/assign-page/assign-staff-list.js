import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import oFetch from 'o-fetch';
import iScroll from 'boss-iscroll';
import ReactIScroll from 'react-iscroll';
import AssignSearch from './assign-search';

const scrollOptions = {
  scrollbars: true,
  mouseWheel: true,
  interactiveScrollbars: true,
  shrinkScrollbars: 'scale',
  fadeScrollbars: false,
  click: true,
  enable_ofscroll: true,
};

class AssignStaffList extends PureComponent {
  renderItems(staffMembers) {
    const itemRenderer = oFetch(this.props, 'itemRenderer');

    return staffMembers.map(staffMember => {
      const staffMemberId = oFetch(staffMember, 'id');

      return React.cloneElement(itemRenderer(staffMember), {
        key: staffMemberId.toString(),
      });
    });
  }

  render() {
    const staffMembers = oFetch(this.props, 'staffMembers');
    return (
      <div className="boss-board__list boss-board__list_layout_reverse boss-board__list_role_daily">
        <div className="boss-board__list-inner boss-board__list-inner_type_static">
          <AssignSearch
            onFilterStaffMembers={this.props.onFilterStaffMembers}
          />
          <ReactIScroll iScroll={iScroll} options={scrollOptions}>
            <div className="boss-board__list-scroll-content">
              <div className="boss-table boss-table_page_ssr-assign">
                {this.renderItems(staffMembers)}
              </div>
            </div>
          </ReactIScroll>
        </div>
      </div>
    );
  }
}

AssignStaffList.propTypes = {
  onFilterStaffMembers: PropTypes.func.isRequired,
  staffMembers: PropTypes.array.isRequired,
  itemRenderer: PropTypes.func.isRequired,
};

export default AssignStaffList;
