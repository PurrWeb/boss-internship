import React from "react"
import StaffDay from "./staff-day"
import {
    connect
} from "react-redux"
import _ from "underscore"
import StaffFilter from '../components/staff-filter';
import utils from '~/lib/utils';
import {fromJS} from 'immutable';
import { bindActionCreators } from "redux"
import actionCreators from "~/redux/actions"

const PAGE_SIZE = 5;
class StaffDayList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      filteredClockInDays: props.clockInDays,
      clockInDays: props.clockInDays.slice(0, PAGE_SIZE),
      filter: '',
      filteredStaffTypes: [],
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

  handleScroll = () => {
    const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
    const windowBottom = windowHeight + window.pageYOffset;
    if (windowBottom >= docHeight) {
      const handleLoadMore = this.state.clockInDays.length !== this.state.filteredClockInDays.length;
      if (handleLoadMore) {
        this.loadMore();
      }
    }
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
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

  componentWillReceiveProps(nextProps) {
    this.handleStaffFilter(nextProps.clockInDays);
  }

  handleStaffFilter = (clockInDays) => {
    const staffMembers = clockInDays.map(clockInDay => clockInDay.staff_member.get(this.props.staffMembers))
    let filteredStaffMembers = [];
    const query = this.state.filter;
    const filteredStaffTypes = this.state.filteredStaffTypes;
    if (filteredStaffTypes.length === 0) {
      filteredStaffMembers = staffMembers;
    } else {
      filteredStaffMembers = staffMembers.filter((staffMember) => {
        if (!filteredStaffTypes.includes(staffMember.staff_type.serverId)) {
          return false;
        }
        return true;
      });
    }

    filteredStaffMembers = utils.staffMemberFilter(query, fromJS(filteredStaffMembers)).toJS();

    const filteredClockInDays = clockInDays.filter(clockInDay => {
      return !!filteredStaffMembers.find(staffMember => staffMember.clientId === clockInDay.staff_member.clientId);
    });

    this.setState(state => {
      if (state.clockInDays.size === filteredClockInDays.size) {
        return {
          filteredClockInDays: filteredClockInDays,
          clockInDays: filteredClockInDays.slice(0, state.clockInDays.size)
        }
      }
      return {
        filteredClockInDays: filteredClockInDays,
        clockInDays: filteredClockInDays.slice(0, PAGE_SIZE)
      }
    });
  }

  onStaffFilterChange = ({filter, filteredStaffTypes}) => {
    this.setState({filter, filteredStaffTypes}, () => {
      this.handleStaffFilter(this.props.clockInDays);
    });
  }

  handleMarkDayAsDone = (clockInDay) => {
    this.props.boundActions.removeClockInDay(clockInDay);
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
        onFilterChange={this.onStaffFilterChange}
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
                  onMarkDayAsDone={this.handleMarkDayAsDone}
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
function mapDispatchToProps(dispatch){
  return {
      boundActions: bindActionCreators(actionCreators(), dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(StaffDayList)
