import React from 'react';
import { selectClockInDayDetails } from "~/redux/selectors"
import utils from '~/lib/utils';
import {fromJS} from 'immutable';
import StaffTypeSelect from './staff-type-select';

export default class StaffFilter extends React.Component {

  state = {
    filter: '',
    filteredStaffTypes: []
  }

  onFilterChange = (value) => {
    this.setState({filter: value}, () => {
      this.getStaffMembers();
    });
  }

  getStaffMembers = () => {
    const staffMembers = this.props.clockInDays.map(clockInDay => clockInDay.staff_member.get(this.props.staffMembers))
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

    const clockInDays = this.props.clockInDays.filter(clockInDay => {
      return !!filteredStaffMembers.find(staffMember => staffMember.clientId === clockInDay.staff_member.clientId);
    });

    this.props.onFilter(clockInDays);
  }

  onStaffTypesChange = (staffTypes) => {
    this.setState({filteredStaffTypes: staffTypes}, () => {
      this.getStaffMembers();
    })
  }

  onClear = () => {
    this.setState({filter: ''}, () => {
      this.getStaffMembers();
    })
  }

  render() {
    const showClearButton = !!this.state.filter.length
    return (
      <div className="boss-page-main__filter">
        <form className="boss-form">
          <div className="boss-form__row boss-form__row_justify_space">
            <div className="boss-form__field boss-form__field_layout_max">
              <div className="boss-form__search">
                <label className="boss-form__label">
                  <input
                    onChange={(e) => this.onFilterChange(e.target.value)}
                    value={this.state.filter}
                    type="text"
                    name="search"
                    placeholder="Search ..."
                    className="boss-form__input"
                  />
                </label>
                {showClearButton && <label onClick={this.onClear} className="boss-form__search-clear">Clear</label>}
              </div>
            </div>
            <div className="boss-form__field boss-form__field_role_control boss-form__field_layout_min-half">
              <p className="boss-form__label">
                <span className="boss-form__label-text">Staff type</span>
              </p>
              <div className="boss-form__select">
                <StaffTypeSelect
                  selectedTypes={this.state.filteredStaffTypes}
                  staffTypes={this.props.staffTypes}
                  label="name"
                  value="serverId"
                  onChange={this.onStaffTypesChange}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    )
  }
}
