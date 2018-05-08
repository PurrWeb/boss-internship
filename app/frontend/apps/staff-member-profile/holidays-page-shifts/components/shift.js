import React, { Component } from 'react';
import PropTypes from 'prop-types';
import oFetch from 'o-fetch';
import { Collapse } from 'react-collapse';

class Shift extends Component {
  state = {
    isOpen: false,
  };

  toggleOpen = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    const shift = oFetch(this.props, 'shift');
    const { isOpen } = this.state;
    const venueName = shift.get('venueName');
    const fromTo = shift.get('fromTo');
    const breaks = shift.get('breaks');
    const rotaed = shift.get('rotaed');
    const accepted = shift.get('accepted');
    const acceptedBy = shift.get('acceptedBy');
    const acceptedOn = shift.get('acceptedOn');

    return (
      <div className="boss-timeline__record">
        <p className="boss-timeline__text boss-timeline__text_role_venue">{venueName}</p>
        <div className="boss-timeline__details">
          <div className="boss-timeline__details-header">
            <p className="boss-timeline__text boss-timeline__text_role_hours">
              <span className="boss-timeline__text-marked">{rotaed}</span> rotaed
              <span className="boss-timeline__text-marked">{' '}{accepted}{' '}</span> accepted
            </p>
            <div
              onClick={this.toggleOpen}
              className={`boss-timeline__details-switch ${isOpen ? '' : 'boss-timeline__details-switch_state_closed'}`}
            >
              Toggle details
            </div>
          </div>
          <Collapse
            isOpened={isOpen}
            className={`boss-timeline__details-content`}
          >
            <div className="boss-timeline__details-inner">
              <p className="boss-timeline__text">
                <span className="boss-timeline__text-faded">From/To:</span> {fromTo}
              </p>
              {breaks && (
                <p className="boss-timeline__text">
                  <span className="boss-timeline__text-faded">Breaks:</span>
                  {breaks}
                </p>
              )}
              {acceptedBy && (
                <p className="boss-timeline__text">
                  <span className="boss-timeline__text-faded">Accepted by </span>
                  {acceptedBy}
                  <span className="boss-timeline__text-faded">on </span>
                  {acceptedOn}
                </p>
              )}
              {acceptedBy ? (
                <a href="#" className="boss-timeline__link boss-timeline__link_role_details">
                  View Details
                </a>
              ) : (
                <a href="#" className="boss-timeline__link boss-timeline__link_role_details">
                  View Rota
                </a>
              )}
            </div>
          </Collapse>
        </div>
      </div>
    );
  }
}

Shift.propTypes = {};

export default Shift;
