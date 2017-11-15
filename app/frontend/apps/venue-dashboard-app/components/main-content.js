import React from 'react';
import classnames from 'classnames';

import MessageCarousel from './message-carousel';

export default class MainContent extends React.Component {
  componentDidMount() {
    window.addEventListener("resize", () => {
      this.renderIframe();
    }, false);
  }

  renderIframe() {
    let $forecast = $('.weather-forecast');
    let $iframe = $('<iframe />');

    $forecast.html('');
    $iframe
      .attr('id', 'forecast_embed')
      .attr('frameborder', 0)
      .attr('height', 245)
      .attr('width', '100%')
      .attr('type', 'text/html')
      .attr('src', `https://forecast.io/embed/#lat=${this.props.currentVenue.latitude || 0}&lon=${this.props.currentVenue.longitude || 0}&units=uk`);

    $forecast.append($iframe);
  }

  render() {
    if (!this.props.currentVenue) {
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
              <h2 className="boss-board__title boss-board__title_size_small">Weekly Weather</h2>
            </header>

            <div className="boss-board__main">
              <div className="boss-board__manager">
                <div className="boss-board__manager-weather">
                  <div className="weather-forecast">
                    <iframe
                      id="forecast_embed"
                      type="text/html"
                      frameBorder="0"
                      height="245"
                      width="100%"
                      src={ `https://forecast.io/embed/#lat=${this.props.currentVenue.latitude || 0}&lon=${this.props.currentVenue.longitude || 0}&units=uk` }
                    >
                    </iframe>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    )
  }
}
