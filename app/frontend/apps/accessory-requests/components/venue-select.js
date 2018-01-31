import React from 'react';
import Select from 'react-select';

class VenueSelect extends React.Component {
  render() {
    const {
      selected,
      venues,
      onChange,
      labelKey,
      valueKey,
    } = this.props;
    console.log('From select: ', selected);
    return (
      <div className="boss-form__control">
        <p className="boss-form__label boss-form__label_type_icon-venue boss-form__label_type_icon-single"></p>
        <div className="boss-form__select">
          <Select
            value={selected}
            valueKey={valueKey}
            labelKey={labelKey}
            onChange={onChange}
            simpleValue
            clearable={false}
            options={venues}
          />
        </div>
      </div>
    )
  }
}

VenueSelect.defaultProps = {
  venues: [],
  labelKey: 'name',
  valueKey: 'id'
}

export default VenueSelect;
