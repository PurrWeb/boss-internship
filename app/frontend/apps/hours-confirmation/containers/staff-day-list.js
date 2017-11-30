import React from "react"
import StaffDay from "./staff-day"
import {
    connect
} from "react-redux"
import _ from "underscore"
import StaffFilter from '../components/staff-filter';

const PAGE_SIZE = 5;
class StaffDayList extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      filteredClockInDays: props.clockInDays,
      clockInDays: props.clockInDays.slice(0, PAGE_SIZE)
    }
  }
  
  getLoadMoreSizes = () => {
    const currentSize = this.state.clockInDays.length;
    const fullSize = this.state.filteredClockInDays.length;
    let loadSize = PAGE_SIZE;
    if ((fullSize - currentSize) < PAGE_SIZE) {
      loadSize = fullSize - currentSize;
    }

    return {currentSize, loadSize};
  }

  loadMore = () => {
    this.setState(state => {
      const {currentSize, loadSize} = this.getLoadMoreSizes();
      const clockInDays = this.state.filteredClockInDays.slice(currentSize, currentSize + loadSize);
      
      return {
        clockInDays: state.clockInDays.concat(clockInDays)
      }
    });
  }

  renderLoadMoreButton = () => {
    return (
      <div className="boss-staff-summary__actions">
        <button
          onClick={this.loadMore}
          className="boss-button boss-button_role_load-more boss-button_adjust_full-mobile"
        >Load More</button>
      </div>
    )
  }
  
  handleStaffFilter = (clockInDays) => {
    this.setState(state => {
      if (state.clockInDays.size === clockInDays.size) {
        return {
          filteredClockInDays: clockInDays,
          clockInDays: clockInDays.slice(0, state.clockInDays.size)
        }
      }
      return {
        filteredClockInDays: clockInDays,
        clockInDays: clockInDays.slice(0, PAGE_SIZE)
      }
    });
  }

  render() {
    var clockInDays = this.state.clockInDays;
    const showLoadMore = this.state.clockInDays.length !== this.state.filteredClockInDays.length;

    const renderNotFound = clockInDays.length === 0 && _.values(this.props.hoursAcceptancePeriods).length === 0;

    return <div className="boss-page-main__inner">
      <StaffFilter
        staffMembers={this.props.staffMembers}
        clockInDays={this.props.clockInDays}
        staffTypes={_.values(this.props.staffTypes)}
        onFilter={this.handleStaffFilter}/>
      { renderNotFound
          ? <div className="boss-page-main__inner boss-page-main__inner_space_regular boss-page-main__inner_opaque">
              <p className="boss-page-main__text-placeholder">There are no hours to confirm.</p>
            </div>
          : clockInDays.map(clockInDay =>
              <StaffDay
                  displayVenue={this.props.displayVenues}
                  displayDate={this.props.displayDates}
                  key={clockInDay.clientId}
                  readonly={clockInDay.readonly}
                  clockInDay={clockInDay} />
            )
      }
      { showLoadMore && this.renderLoadMoreButton() }
    </div>
  }
}

function mapStateToProps(state) {
    return {
        clockInDays: [..._.values(state.clockInDays), ..._.values(state.readonlyClockInDays)],
        staffMembers: state.staffMembers,
        staffTypes: state.staffTypes,
    }
}

export default connect(mapStateToProps)(StaffDayList)
