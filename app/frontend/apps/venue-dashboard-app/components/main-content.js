import React from 'react';
import classnames from 'classnames';

import MessageCarousel from './message-carousel';
import Skycons from '~/components/skycons';

const CURRENT_DAY_LABEL = 'Current';
const WEEK_DAY_LABELS = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat'
];

const ICON_TO_CONDITION_CLASS = {
  'clear-day': 'clear',
  'clear-night': 'clear',
  'rain': 'rain',
  'snow': 'heavy-rain',
  'sleet': 'heavy-rain',
  'wind': 'sprinkling-flurries',
  'fog': 'sprinkling-flurries',
  'cloudy': 'cloudy',
  'partly-cloudy-day': 'partly-cloudy',
  'partly-cloudy-night': 'partly-cloudy'
};

const ICON_TO_CONDITION_TEXT = {
  'clear-day': 'Clear',
  'clear-night': 'Clear',
  'rain': 'Rain',
  'snow': 'Snow',
  'sleet': 'Sleet',
  'wind': 'Wind',
  'fog': 'Fog',
  'cloudy': 'Overcast',
  'partly-cloudy-day': 'Partly Cloudy',
  'partly-cloudy-night': 'Partly Cloudy'
};

export default class MainContent extends React.Component {
  state = {};

  componentDidUpdate(prevProps) {
    if (this.props.currentVenue && !prevProps.currentVenue) {
      let lat = this.props.currentVenue.latitude || 0;
      let long = this.props.currentVenue.longitude || 0;

      fetch(`http://localhost:3001/forecast?lat=${encodeURIComponent(lat)}&long=${encodeURIComponent(long)}`)
      .then((res) => res.json()).then(data => {
        this.setState({ data: data });
      });
    }
  }

  render() {
    if (!this.state.data) {
      return(
        <div></div>
      )
    }

    console.log(this.state.data);

    const { currently, daily, offset } = this.state.data.current;
    const { hourly } = this.state.data.time;

    let dailyHighest = -Infinity;
    let dailyLowest = Infinity;

    daily.data.forEach((day) => {
      if (day.temperatureHigh > dailyHighest) {
        dailyHighest = day.temperatureHigh;
      }

      if (day.temperatureLow < dailyLowest) {
        dailyLowest = day.temperatureLow;
      }
    });

    dailyHighest = Math.round(dailyHighest);
    dailyLowest = Math.round(dailyLowest);

    const dayTimeline = [];

    hourly.data.forEach(hour => {
      const summary = ICON_TO_CONDITION_TEXT[hour.icon];

      if (
        dayTimeline.length &&
        dayTimeline[dayTimeline.length - 1].summary === summary
      ) {
        dayTimeline[dayTimeline.length - 1].hours += 1;
      } else {
        dayTimeline.push({
          icon: hour.icon,
          summary: summary,
          hours: 1,
        });
      }
    });

    console.log('dayTimeline', dayTimeline);

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
                  <div className="boss-weather">
                    <div className="boss-weather__daily">
                      <div className="boss-weather__summary">
                        <div className="boss-weather__summary-primary">
                          <div className="boss-weather__summary-temp">
                            {Math.round(currently.temperature)}&deg;
                          </div>
                          <div className="boss-weather__summary-icon">
                            <Skycons
                              type={currently.icon}
                              color="#4c4c4c"
                              width="60"
                              height="60"
                            />
                          </div>
                        </div>
                        <div className="boss-weather__summary-secondary">
                          <h3 className="boss-weather__summary-title">
                            {currently.summary}
                          </h3>
                          <p className="boss-weather__summary-text">
                            {daily.data[0].summary}
                          </p>
                        </div>
                      </div>

                      <div className="boss-weather__timeline">
                        <div className="boss-weather__timeline-conditions">
                          {dayTimeline.map((condition, i) => {
                            const className = `boss-weather__timeline-condition boss-weather__timeline-condition_${ICON_TO_CONDITION_CLASS[condition.icon]}`;

                            return <div
                              data-icon={condition.icon}
                              key={i}
                              className={className}
                              style={{
                                width: 100 / 24 * condition.hours + '%',
                              }}
                              title={condition.summary}
                            >
                              <p className="boss-weather__timeline-label">
                                {condition.summary}
                              </p>
                            </div>
                          })}
                        </div>
                        <div className="boss-weather__timeline-intervals">
                          {hourly.data.map((hour, i) => {
                            return <div
                              key={i}
                              className="boss-weather__timeline-interval"
                            >
                              <div className="boss-weather__timeline-data">
                                <div className="boss-weather__timeline-hour">
                                  {i}
                                </div>
                                <div className="boss-weather__timeline-temp">
                                  {Math.round(hour.temperature)}&deg;
                                </div>
                              </div>
                            </div>
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="boss-weather__weekly">
                      <div className="boss-weather__forecast boss-weather__forecast_horizontal boss-weather__forecast_hidden-mobile">
                        <div className="boss-weather__forecast-days">
                          {daily.data.map((day, i) => {
                            let label;

                            if (i === 0) {
                              label = CURRENT_DAY_LABEL;
                            } else {
                              const time = day.time * 1000 + offset * 60 * 60 * 1000;
                              const date = new Date(time);
                              const weekDay = date.getUTCDay();

                              label = WEEK_DAY_LABELS[weekDay];
                            }

                            return <ForecastDay
                              key={label + i}
                              direction="vertical"
                              label={label}
                              icon={day.icon}
                              high={Math.round(day.temperatureHigh)}
                              low={Math.round(day.temperatureLow)}
                              highest={dailyHighest}
                              lowest={dailyLowest}
                              summary={day.summary}
                            />
                          })}
                        </div>
                      </div>

                      <div className="boss-weather__forecast boss-weather__forecast_vertical boss-weather__forecast_visible-mobile">
                        <div className="boss-weather__forecast-days">
                          {daily.data.map((day, i) => {
                            let label;

                            if (i === 0) {
                              label = CURRENT_DAY_LABEL;
                            } else {
                              const time = day.time * 1000 + offset * 60 * 60 * 1000;
                              const date = new Date(time);
                              const weekDay = date.getUTCDay();

                              label = WEEK_DAY_LABELS[weekDay];
                            }

                            return <ForecastDay
                              key={label + i}
                              direction="horizontal"
                              label={label}
                              icon={day.icon}
                              high={Math.round(day.temperatureHigh)}
                              low={Math.round(day.temperatureLow)}
                              highest={dailyHighest}
                              lowest={dailyLowest}
                              summary={day.summary}
                            />
                          })}
                        </div>
                      </div>
                    </div>
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

function ForecastDay({ label, icon, high, low, highest, lowest, direction, summary }) {
  const currentRange = high - low;
  const maxRange = highest - lowest;
  const offset = highest - high;

  let rangeStyle;

  if (direction === 'horizontal') {
    rangeStyle = {
      width: 100 / maxRange * currentRange + '%',
      left: 100 / maxRange * offset + '%',
    };
  } else if (direction === 'vertical') {
    rangeStyle = {
      height: 100 / maxRange * currentRange + '%',
      top: 100 / maxRange * offset + '%',
    };
  }

  return <div className="boss-weather__forecast-day">
    <div className="boss-weather__forecast-info">
      <p className="boss-weather__forecast-label">{label}</p>
      <div className="boss-weather__forecast-icon">
        <Skycons
          type={icon}
          color="#4c4c4c"
          width="40"
          height="40"
          title={summary}
        />
      </div>
    </div>
    <div className="boss-weather__forecast-temp">
      <div className="boss-weather__forecast-range" style={rangeStyle}>
        <p className="boss-weather__forecast-high">{high}&deg;</p>
        <div className="boss-weather__forecast-indicator"></div>
        <p className="boss-weather__forecast-low">{low}&deg;</p>
      </div>
    </div>
  </div>
}


/*function ForecastTempVertical({ high, low }) {
  const rangeLength = high - low;


  return <div className="boss-weather__forecast-temp">
    <div className="boss-weather__forecast-range" style={{

    }}>
      <p className="boss-weather__forecast-high">{high}&deg;</p>
      <div className="boss-weather__forecast-indicator"></div>
      <p className="boss-weather__forecast-low">{low}&deg;</p>
    </div>
  </div>
}*/