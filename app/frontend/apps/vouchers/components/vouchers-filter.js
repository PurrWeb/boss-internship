import React from 'react';
import cn from 'classnames';

export default class VouchersFilter extends React.Component {

  toggleFilter = () => {
    this.props.onToggleFilter();
  };

  render() {

    let allLabelClass = cn('boss-form__switcher-label-text', {'boss-form__switcher-label-text_state_active': this.props.status === 'all'}),
        activeLabelClass = cn('boss-form__switcher-label-text', {'boss-form__switcher-label-text_state_active': this.props.status === 'active'})

    return <div className="boss-page-main__filter">
      <div className="boss-form__row boss-form__row_justify_space boss-form__row_position_last">
        <div className="boss-form__field boss-form__field_role_control boss-form__field_layout_fluid">
          <p className="boss-form__label boss-form__label_type_icon-date">
            <span className="boss-form__label-text">Used</span>
          </p>
          <div className="date-range-picker date-range-picker_adjust_control">

          </div>
        </div>
        <div className="boss-form__field boss-form__field_layout_fluid">
          <div className="boss-form__switcher">
            <label className="boss-form__switcher-label">
              <input name="displayAll" className="boss-form__switcher-radio" />
              <span onClick={this.toggleFilter} className={allLabelClass}>Show All</span>
            </label>
            <label className="boss-form__switcher-label">
              <input  name="displayActive" className="boss-form__switcher-radio" />
              <span onClick={this.toggleFilter} className={activeLabelClass}>Show Active</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  }
};