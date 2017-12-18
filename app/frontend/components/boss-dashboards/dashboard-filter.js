import React from 'react';
import PropTypes from 'prop-types';

class DashboardFilter extends React.Component {
  state = {
    isOpen: false,
  }

  toggleFilter = () => {
    this.setState(state => ({isOpen: !state.isOpen}));
  }

  renderFilterContent(FilterContentComponent) {
    return (
      <div className="boss-dropdown__content" style={{display: this.state.isOpen ? 'block' : ''}}>
        <div className="boss-dropdown__content-inner">
          <FilterContentComponent onFilter={this.props.onFilter} />
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="boss-page-dashboard__filter">
        <div className={`boss-dropdown ${this.state.isOpen ? 'boss-dropdown__content_state_opened' : ''}`}>
          <div className="boss-dropdown__header">
            <button
              onClick={this.toggleFilter}
              className={`boss-dropdown__switch boss-dropdown__switch_role_filter ${this.state.isOpen ? 'boss-dropdown__switch_state_opened' : ''}`}
            >{this.props.title}</button>
          </div>
          {this.renderFilterContent(this.props.component)}
        </div>
      </div>
    )
  }
}

DashboardFilter.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
  component: PropTypes.func.isRequired
}

DashboardFilter.defaultProps = {
  title: 'Filter',
  className: ''
}

export default DashboardFilter;
