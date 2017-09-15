import React from 'react';

import FormDateInterval from './form-date-interval';
import BossSelect from '~/components/boss-select';

class IncidentReportsFilter extends React.Component {
  
  constructor(props) {
    super(props);
  }

  onDatesChange = ({startDate, endDate}) => {
    this.props.onStartEndChange({startDate, endDate})
  }

  handleCreatorChange = (creator) => {
    const creatorId = creator ? creator.value : null;
    this.props.onCreatorChange(creatorId);
  }

  handleUpdateClick = () => {
    this.props.handleUpdateClick();
  }

  render() {
    const {
      reportCreators,
      selectedCreatorId,
      handleUpdateClick,
      onCreatorChange,
      onStartEndChange,
    } = this.props;

    const selectedCreator = reportCreators.find(creator => creator.get('id') == selectedCreatorId) || null;

    return (
      <div className="boss-dropdown__content boss-dropdown__content_state_opened">
        <div className="boss-dropdown__content-inner">
          <div className="boss-form">
            <div className="boss-form__row">
              <FormDateInterval
                label="Date"
                startDate={this.props.startDate}
                endDate={this.props.endDate}
                fieldClassName="boss-form__field_layout_half"
                onDatesChange={this.onDatesChange}
              />
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
              <button
                onClick={this.handleUpdateClick}
                className="boss-button boss-form__submit boss-form__submit_adjust_single"
              >Update</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default IncidentReportsFilter;
