import React from 'react';
import PropTypes from 'prop-types';
import VenuesSelect from '~/components/select-venue';

class Dashboard extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
  }

  render() {
    return (
      <div className="boss-page-main__dashboard">
        <div className="boss-page-main__inner">
          <div className="boss-page-dashboard boss-page-dashboard_updated">
            <div className="boss-page-dashboard__group">
              <h1 className="boss-page-dashboard__title">{this.props.title}</h1>
              <div className="boss-page-dashboard__controls-group">
                
              </div>
            </div>
            <div className="boss-page-dashboard__group">
              <div className="boss-page-dashboard__buttons-group boss-page-dashboard__buttons-group_position_last">
                  <button type="button" onClick={this.props.onAddClick.bind(null, {})} className="boss-button boss-button_role_add boss-page-dashboard__button">Add new</button>
              </div>
            </div>
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}

export default Dashboard;
