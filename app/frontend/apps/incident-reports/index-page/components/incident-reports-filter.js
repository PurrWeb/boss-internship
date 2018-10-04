import React from 'react';
import AsyncButton from 'react-async-button';

import BossDateRangePicker from '~/components/react-dates/boss-date-range-picker';
import BossSelect from '~/components/boss-select';

class IncidentReportsFilter extends React.Component {

  onDatesChange = ({startDate, endDate}) => {
    this.props.onStartEndChange({startDate, endDate})
  }

  handleCreatorChange = (creator) => {
    const creatorId = creator ? creator.value : null;
    this.props.onCreatorChange(creatorId);
  }

  handleUpdateClick = () => {
    return this.props.handleUpdateClick();
  }

  render() {
    const {
      reportCreators,
      selectedCreatorId,
    } = this.props;

    const selectedCreator = reportCreators.find(creator => creator.get('id') == selectedCreatorId) || null;

    return (
      <div className="boss-dropdown__content boss-dropdown__content_state_opened">
        <div className="boss-dropdown__content-inner">
          <div className="boss-form">
            <div className="boss-form__row">
              <div className="boss-form__field boss-form__field_layout_half">
                <p className="boss-form__label"><span className="boss-form__label-text">Date</span></p>
                <div className="date-control date-control_type_icon date-control_type_interval-fluid">
                  <BossDateRangePicker
                    startDateId="startDateId"
                    endDateId="endDateId"
                    startDate={this.props.startDate}
                    endDate={this.props.endDate}
                    onApply={this.onDatesChange}
                  />
                </div>
              </div>
              <div className="boss-form__field boss-form__field_layout_half boss-form__field_position_last">
                <label className="boss-form__label">
                  <span className="boss-form__label-text">Created By</span>
                </label>
                <div className="boss-form__select">
                  <BossSelect
                    selected={selectedCreator && selectedCreator.toJS()}
                    options={reportCreators.toJS()}
                    onChange={this.handleCreatorChange}
                    label="name"
                    value="id"
                  />
                </div>
              </div>
            </div>
            <div className="boss-form__field">
            <AsyncButton
              onClick={this.handleUpdateClick}
              className="boss-button boss-form__submit boss-form__submit_adjust_single"
              text="Update"
              pendingText="Updating ..."
            />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default IncidentReportsFilter;
