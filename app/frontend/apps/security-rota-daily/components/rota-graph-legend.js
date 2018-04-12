import React, { Component } from 'react';
import PropTypes from 'prop-types';

class RotaGraphLegend extends Component {
  render() {
    return (
      <div className="rota-chart__legend">
        <div className="boss-rotas-info boss-rotas-info_layout_row">
          <ul className="boss-rotas-info__list">
          {this.props.venueTypes.map(venue => (
            <li key={venue.id} className="boss-rotas-info__item">
              <span
                className="boss-rotas-info__pointer"
                style={{backgroundColor: venue.color}}
              />
              <p className="boss-rotas-info__text">
                <span>{venue.name}</span>: <span>{venue.count}</span>
              </p>
            </li>
          ))}
          </ul>
        </div>
      </div>
    );
  }
}

RotaGraphLegend.propTypes = {
  venueTypes: PropTypes.array.isRequired,
};

export default RotaGraphLegend;
