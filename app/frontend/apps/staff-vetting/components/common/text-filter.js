import React, { Component } from 'react';
import oFetch from 'o-fetch';

export default class TextFilter extends Component {
  onChange = e => {
    const onChange = oFetch(this.props, 'onChange');
    const value = e.target.value;
    onChange(value);
  };

  render() {
    const placeholder = oFetch(this.props, 'placeholder');
    const value = oFetch(this.props, 'value');

    return (
      <div className="boss-page-main__filter">
        <div className="boss-form">
          <div className="boss-form__row boss-form__row_position_last">
            <div className="boss-form__field">
              <div className="boss-form__search">
                <input
                  type="text"
                  placeholder={placeholder}
                  value={value}
                  onChange={this.onChange}
                  className="boss-form__input"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

TextFilter.defaultProps = {
  placeholder: 'Start typing here ...',
};
