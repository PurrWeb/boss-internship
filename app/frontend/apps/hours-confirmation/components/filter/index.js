import React from 'react';
import StaffTypeSelect from './staff-type-select';
import { connect } from 'react-redux';
import utils from '~/lib/utils';

const mapStateToProps = state => {
  return {
    staffTypes: state.get('staffTypes'),
    staffMembers: state.get('staffMembers'),
  };
};

@connect(mapStateToProps)
export default class StaffFilter extends React.Component {
  state = {
    filter: '',
    filteredStaffMembers: [],
    filteredStaffTypes: [],
  };

  handleStaffFilter = () => {
    const staffMembers = this.props.staffMembers;
    let filteredStaffMembers;
    const query = this.state.filter;
    const filteredStaffTypes = this.state.filteredStaffTypes;

    if (filteredStaffTypes.length === 0) {
      filteredStaffMembers = staffMembers;
    } else {
      filteredStaffMembers = staffMembers.filter(staffMember =>
        filteredStaffTypes.includes(staffMember.get('staffType')),
      );
    }

    filteredStaffMembers = utils.staffMemberFilterFullName(
      query,
      filteredStaffMembers,
    );

    return filteredStaffMembers.map(staffMember => staffMember.get('id')).toJS();
  };

  onFilterChange = value => {
    this.setState({ filter: value }, () => {
      this.props.onFilterChange(this.handleStaffFilter());
    });
  };

  onStaffTypesChange = staffTypes => {
    this.setState({ filteredStaffTypes: staffTypes }, () => {
      this.props.onFilterChange(this.handleStaffFilter());
    });
  };

  onClear = () => {
    this.setState({ filter: '' }, () => {
      this.props.onFilterChange(this.handleStaffFilter());
    });
  };

  render() {
    const showClearButton = !!this.state.filter.length;
    return (
      <div className="boss-page-main__filter">
        <form className="boss-form">
          <div className="boss-form__row boss-form__row_justify_space">
            <div className="boss-form__field boss-form__field_layout_max">
              <div className="boss-form__search">
                <label className="boss-form__label">
                  <input
                    onChange={e => this.onFilterChange(e.target.value)}
                    value={this.state.filter}
                    type="text"
                    name="search"
                    placeholder="Search ..."
                    className="boss-form__input"
                  />
                </label>
                {showClearButton && (
                  <label
                    onClick={this.onClear}
                    className="boss-form__search-clear"
                  >
                    Clear
                  </label>
                )}
              </div>
            </div>
            <div className="boss-form__field boss-form__field_role_control boss-form__field_layout_min-half">
              <p className="boss-form__label">
                <span className="boss-form__label-text">Staff type</span>
              </p>
              <div className="boss-form__select">
                <StaffTypeSelect
                  selectedTypes={this.state.filteredStaffTypes}
                  staffTypes={this.props.staffTypes.toJS()}
                  label="name"
                  value="id"
                  onChange={this.onStaffTypesChange}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
