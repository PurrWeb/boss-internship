import React from 'react';
import utils from '~/lib/utils';

import StaffTypeSelect from './staff-type-select';
import StaffMemberList from './staff-member-list';
import AddMultipleShift from './add-multiple-shift';
class AddShifts extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      searchQuery: '',
      filteredAddShiftsStaffType: [],
      filteredAddShiftsStaffs: [],
    }
  }
  
  getStaffMembers = () => {
    const filteredStaffTypes = this.state.filteredAddShiftsStaffType;
    const searchQuery = this.state.searchQuery;
    
    let filteredStaffMembers = [];

    if (filteredStaffTypes.length === 0) {
      filteredStaffMembers = this.props.staffMembers;
    } else {
      filteredStaffMembers = this.props.staffMembers.filter((staffMember) => {
        if (!filteredStaffTypes.includes(staffMember.get('staff_type'))) {
          return false;
        }
        return true;
      });
    }
    return utils.staffMemberFilter(searchQuery, filteredStaffMembers);
  }

  onSearchChange = (event) => {
    this.setState({searchQuery: event.target.value});
  }
  
  onStaffTypesChange = (staffTypeIds) => {
    this.setState({filteredAddShiftsStaffType: staffTypeIds})
  }

  render() {
    return (
      <div className="boss-rotas__manager">
        <div className="boss-rotas__filter boss-rotas__filter_type_inner">
          <div className="boss-form">
            <div className="boss-form__row">
              <div className="boss-form__field boss-form__field_layout_max">
                <div className="boss-form__search boss-form__search_type_light">
                  <label className="boss-form__label">
                    <input
                      onChange={this.onSearchChange}
                      value={this.state.searchQuery}
                      type="text"
                      className="boss-form__input"
                      placeholder="Search ..."
                    />
                  </label>
                </div>
              </div>
              <div className="boss-form__field boss-form__field_role_control boss-form__field_layout_min">
                <p className="boss-form__label boss-form__label_type_light">
                  <span className="boss-form__label-text">Staff Type</span>
                </p>
                <StaffTypeSelect
                  selectedTypes={this.state.filteredAddShiftsStaffType}
                  staffTypes={this.props.staffTypes.toJS()}
                  onChange={this.onStaffTypesChange}
                />
              </div>
              <div className="boss-form__field boss-form__field_layout_fluid">
                {this.props.isMultipleShift
                  ? <button
                      onClick={this.props.onCloseMultipleShift}
                      className="boss-button boss-button_role_cancel boss-button_adjust_full-mobile"
                    >Cancel</button>
                  : <button
                      onClick={this.props.onOpenMultipleShift}
                      className="boss-button boss-button_role_add boss-button_adjust_full-mobile"
                    >Add Multiple Shift</button>
                }
              </div>
            </div>
            {this.props.isMultipleShift && <AddMultipleShift rotaStatus={this.props.rotaStatus} rotaDate={this.props.rotaDate}/>}
          </div>
        </div>
        <StaffMemberList
          staffMembers={this.getStaffMembers()}
          staffTypes={this.props.staffTypes}
          rotaDate={this.props.rotaDate}
          rotaStatus={this.props.rotaStatus}
          isMultipleShift={this.props.isMultipleShift}
        />
      </div>
    )
  }
}

export default AddShifts;
