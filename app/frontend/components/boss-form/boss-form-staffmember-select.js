import React from 'react';
import Select from 'react-select';
import humanize from 'string-humanize';
import _ from 'lodash';
import { List, Map } from 'immutable';
import {httpWithoutNotify} from '~/lib/request-api';

class BossFormStaffmemberSelect extends React.PureComponent{
  state = {
    options: [],
    isLoading: false,
  };

  getItemOption = (option, {value, label}) => {
    let normalizedLabel = null;
    let extra = {};

    if (typeof this.props.normalizeLabel === 'function') {
      normalizedLabel = this.props.normalizeLabel(option);
    }

    if (typeof this.props.extraOption === 'function') {
      extra = this.props.extraOption(option);
    }
    
    return {
      value: option[value || 'value'],
      label: normalizedLabel || option[label || 'label'],
      model: option,
      ...extra
    };
  }

  getOptions = (options, {value, label}) => {
    return options.map((option, key) => {
      if (Object.prototype.toString.call(option) === '[object Object]') {
        return this.getItemOption(option, {value, label});
      } else {
        return {
          label: option,
          value: option
        }
      }
    });
  }
  
  loadOptions = (query, {label, value}) => {
    if (!query) {
			return;
		} else {
      httpWithoutNotify().get('/api/v1/staff_members', {
        params: {
          query: query,
          venue_id: this.props.venueId,
        }
      }).then(resp => {
        this.setState({isLoading: false, options: this.getOptions(resp.data, {label, value})})
      });
    }
  }

  debouncedLoadOptions = _.debounce(this.loadOptions, 500);

  onInputChange = (query) => {
    if (!!query) {
      this.setState({isLoading: true}, () => {
        this.debouncedLoadOptions(query, {label: this.props.optionLabel, value: this.props.optionValue})
      });
    }
  }

  render() {
    const {
      label,
      options,
      optionValue,
      optionLabel,
      normalizeLabel,
      required,
      multi = false,
      placeholder = 'Select ...',
      disabled,
      clearable = true,
      extraOption,
      valueComponent = undefined,
      optionComponent = undefined,
      input: { onBlur, value, onChange, name },
      meta: { asyncValidating, touched, error },
    } = this.props;

    return (
      <div className="boss-form__field">
        { label && (
          <label htmlFor={name} className="boss-form__label">
            <span className="boss-form__label-text">{`${label} ${required ? '*' : ''}`}</span>
          </label>
        )}
        <div className={`boss-form__select ${touched && error && 'boss-form__select_state_error'}`}>
          <Select
            options={this.state.options}
            onChange={onChange}
            name={name}
            isLoading={this.state.isLoading}
            onBlur={() => onBlur(value)}
            ignoreCase
            onInputChange={this.onInputChange}
            disabled={disabled}
            clearable={clearable}
            valueComponent={valueComponent}
            optionComponent={optionComponent}
            placeholder={placeholder}
            value={value}
            noResultsText='No results found'
          />
        </div>
        {
          touched && error &&
            <div className="boss-form__error">
              <p className="boss-form__error-text">
                <span className="boss-form__error-line">{error}</span>
              </p>
            </div>
        }
      </div>
    )
  }
}

export default BossFormStaffmemberSelect;
