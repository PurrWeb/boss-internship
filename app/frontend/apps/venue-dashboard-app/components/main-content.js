import React from 'react';
import classnames from 'classnames';

import MessageCarousel from './message-carousel';
import WeatherWidget from './weather-widget';

export default class MainContent extends React.Component {
  render() {
    const { currentVenue } = this.props;

    if (!currentVenue) {
      return(
        <div></div>
      )
    }

    return (
      <div className="boss-page-main__content">
        <div className="boss-page-main__inner boss-page-main__inner_opaque boss-page-main__inner_space_large">
          <MessageCarousel { ...this.props } />

          <section className="boss-board boss-board_context_stack boss-board_role_panel">
            <header className="boss-board__header">
              <h2 className="boss-board__title boss-board__title_size_small">Weather</h2>
            </header>
            <div className="boss-board__main">
              <div className="boss-board__manager">
                <div className="boss-board__manager-weather">
                  <WeatherWidget
                    lat={currentVenue.latitude}
                    long={currentVenue.longitude}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    )
  }
}