import React from 'react';

import StaffTypeSelect from './staff-type-select';
import RotaFilter from './rota-filter';
import RotaDayFilter from './rota-day-filter';

class RotaDailyGraphFilter extends React.Component {
  render() {
    return (
      <div className="boss-rotas__graphs-filter">
        <div className="boss-form">
          <div className="boss-form__row boss-form__row_justify_space boss-form__row_desktop">
            <div className="boss-form__field boss-form__field_role_control boss-form__field_layout_min">
              <p className="boss-form__label boss-form__label_type_icon-filter">
                <span className="boss-form__label-text">Filter chart</span>
              </p>
              <StaffTypeSelect
                selectedTypes={this.props.selectedTypes}
                staffTypes={this.props.staffTypes}
                onChange={this.props.onStaffTypesChange}
              />
            </div>
            <RotaFilter
              currentRotaDay={this.props.rotaDate}
            />
          </div>
          <RotaDayFilter currentRotaDay={this.props.rotaDate} />
          <div className="boss-form__row boss-form__row_justify_space boss-form__row_mobile boss-form__row_position_last">
            <div className="boss-form__field boss-form__field_role_control boss-form__field_layout_min">
              <p className="boss-form__label boss-form__label_type_icon-filter">
                <span className="boss-form__label-text">Filter chart</span>
              </p>
              <StaffTypeSelect
                selectedTypes={this.props.selectedTypes}
                staffTypes={this.props.staffTypes}
                onChange={this.props.onStaffTypesChange}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default RotaDailyGraphFilter;
