import React from 'react';
import oFetch from 'o-fetch';

import MessageCarousel from './message-carousel';
import WeatherWidget from './weather-widget';

export default class MainContent extends React.Component {
  render() {
    const currentVenue = oFetch(this.props, 'currentVenue');
    const accessToken = oFetch(this.props, 'accessToken');
    const renderWeatherWidget = oFetch(this.props, 'renderWeatherWidget');

    if (!currentVenue) {
      return null;
    }

    return (
      <div className="boss-page-main__content">
        <div className="boss-page-main__inner boss-page-main__inner_opaque boss-page-main__inner_space_large">
          <MessageCarousel {...this.props} />

          <section className="boss-board boss-board_context_stack boss-board_role_panel">
            <header className="boss-board__header">
              <h2 className="boss-board__title boss-board__title_size_small">Weekly Weather</h2>
            </header>
            <div className="boss-board__main">
              <div className="boss-board__manager">
                <div className="boss-board__manager-weather">
                  {renderWeatherWidget && (
                    <WeatherWidget venueId={oFetch(currentVenue, 'id')} accessToken={accessToken} />
                  )}
                  {!renderWeatherWidget && <p>Disabled</p>}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
}
