import React from 'react';
import PropTypes from 'prop-types';

import VenuesSelect from '~/components/select-venue';
import BossSelect from '~/components/boss-select';
import { DateRangePicker } from 'react-dates';


class SubmissionsFilter extends React.PureComponent {
  static propTypes = {
  }

  constructor(props) {
    super(props);

    this.state = {
      focusedInput: null,
    }
  }
  
  onCretedByChange = (createdBy) => {
    this.props.onCretedByChange(createdBy && createdBy.value)
  }

  onStatusChange = (status) => {
    this.props.onStatusChange(status && status.value);
  }

  render() {
    const {
      venues,
      isFilterOpen,
      submissions,
      startDate,
      endDate,
      onToggleFilter,
      onSelectVenue,
      onDatesChange,
      currentVenue,
      onSearch,
      createdBy,
      status,
    } = this.props;

    const checkListOptions = submissions.groupBy(x => x.get('check_list_name')).map(x => x.first()).toList().toJS();
    const createdByOptions = submissions.groupBy(x => x.get('creator_name')).map(x => x.first()).toList().toJS();

    const statusOptions = [{value: true, label: "Ok"}, {value: false, label: "Problem"}];

    const selectedCreatedBy = createdByOptions.filter(item => item.creator_id === createdBy)[0];
    const selectedStatus = statusOptions.filter(item => item.value === status)[0];
    const filterCn = isFilterOpen ? 'boss-dropdown__content_state_opened' : '';
    const filterButtonCn = isFilterOpen ? 'boss-dropdown__switch_state_opened' : '';

    return (
      <div className={`boss-page-dashboard__filter ${filterCn}`}>
        <div className="boss-dropdown">
          <div className="boss-dropdown__header">
            <div className="boss-dropdown__header-group">
            </div>
            <button
              onClick={onToggleFilter}
              className={`boss-dropdown__switch boss-dropdown__switch_role_filter ${filterButtonCn}`}
            >Filter</button>
          </div>
          <div className="boss-dropdown__content" style={{display: isFilterOpen ? 'block' : 'none'}}>
            <div className="boss-dropdown__content-inner">
              <div className="boss-form">
                <div className="boss-form__row">
                  <div className="boss-form__field boss-form__field_layout_third">
                    <label className="boss-form__label">
                      <span className="boss-form__label-text">Date</span>
                    </label>
                    <div className="date-range-picker date-range-picker_type_interval-fluid date-range-picker_type_icon">
                      <DateRangePicker
                        numberOfMonths={1}
                        withPortal
                        showClearDates
                        displayFormat={"DD/MM/YYYY"}
                        isOutsideRange={() => false}
                        startDate={startDate}
                        endDate={endDate}
                        onDatesChange={onDatesChange}
                        focusedInput={this.state.focusedInput}
                        onFocusChange={focusedInput => this.setState({ focusedInput })}
                      />
                    </div>
                  </div>
                  <div className="boss-form__field boss-form__field_layout_third">
                    <label className="boss-form__label">
                      <span className="boss-form__label-text">Created By</span>
                    </label>
                    <BossSelect
                      options={createdByOptions}
                      selected={selectedCreatedBy}
                      onChange={this.onCretedByChange}
                      label="creator_name"
                      value="creator_id"
                      mappedProps={
                        {
                          placeholder: "Select created by ..."
                        }
                      }
                    />
                  </div>
                  <div className="boss-form__field boss-form__field_layout_third">
                    <label className="boss-form__label">
                      <span className="boss-form__label-text">Status</span>
                    </label>
                    <BossSelect
                      options={statusOptions}
                      onChange={this.onStatusChange}
                      selected={selectedStatus}
                      mappedProps={
                        {
                          placeholder: "Select status ..."
                        }
                      }
                    />
                  </div>
                </div>
                <div className="boss-form__field">
                  <button onClick={onSearch} className="boss-button boss-form__submit boss-form__submit_adjust_single">
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default SubmissionsFilter;
