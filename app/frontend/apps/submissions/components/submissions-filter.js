import React from 'react';

import BossSelect from '~/components/boss-select';
import BossDateRangePicker from '~/components/react-dates/boss-date-range-picker';
import AsyncButton from 'react-async-button';



class SubmissionsFilter extends React.PureComponent {
  
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
                    <div className="date-control date-control_type_icon date-control_type_interval-fluid">
                      <BossDateRangePicker
                        startDateId="startDate"
                        endDateId="endDate"
                        startDate={startDate}
                        endDate={endDate}
                        onApply={onDatesChange}
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
                  <AsyncButton
                    className="boss-button boss-form__submit boss-form__submit_adjust_single"
                    text="Update"
                    pendingText="Updating..."
                    onClick={onSearch}
                  />
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
