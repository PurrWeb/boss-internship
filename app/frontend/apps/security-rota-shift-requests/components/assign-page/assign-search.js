import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class AssignSearch extends PureComponent {
  state = {
    searchQuery: '',
  }

  onSearchChange = (event) => {
    const searchQuery = event.target.value;
    this.setState({searchQuery}, () => {
      this.props.onFilterStaffMembers(searchQuery)
    });
  }

  render() {
    return (
      <div className="boss-board__list-header">
        <form className="boss-form">
          <div className="boss-form__field">
            <div className="boss-form__search">
              <label className="boss-form__label">
                <input
                  onChange={this.onSearchChange}
                  value={this.state.searchQuery}
                  type="text"
                  className="boss-form__input"
                  placeholder="Search ..."
                />
              </label>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

AssignSearch.propTypes = {
  onFilterStaffMembers: PropTypes.func.isRequired,
};

export default AssignSearch;
