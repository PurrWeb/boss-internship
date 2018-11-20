import React from 'react';
import oFetch from 'o-fetch';
import axios from 'axios';

import Skycons from '~/components/skycons';

const CURRENT_DAY_LABEL = 'Current';
const WEEK_DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const ICON_TO_CONDITION_CLASS = {
  'clear-day': 'clear',
  'clear-night': 'clear',
  rain: 'rain',
  snow: 'heavy-rain',
  sleet: 'heavy-rain',
  wind: 'sprinkling-flurries',
  fog: 'sprinkling-flurries',
  cloudy: 'cloudy',
  'partly-cloudy-day': 'partly-cloudy',
  'partly-cloudy-night': 'partly-cloudy',
};

const ICON_TO_CONDITION_TEXT = {
  'clear-day': 'Clear',
  'clear-night': 'Clear',
  rain: 'Rain',
  snow: 'Snow',
  sleet: 'Sleet',
  wind: 'Wind',
  fog: 'Fog',
  cloudy: 'Overcast',
  'partly-cloudy-day': 'Partly Cloudy',
  'partly-cloudy-night': 'Partly Cloudy',
};

export default class WeatherWidget extends React.Component {
  static defaultProps = {
    lat: 0,
    long: 0,
  };

  state = {
    data: null,
    error: null,
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.lat !== prevProps.lat || this.props.long !== prevProps.long) {
      this.fetchData();
    }
  }

  fetchData() {
    const [venueId, accessToken] = oFetch(this.props, 'venueId', 'accessToken');

    axios
      .get(`api/v1/venue_dashboard_forecasts/${venueId}`, {
        params: {},
        headers: {
          Authorization: `Token token="${accessToken}"`,
        },
      })
      .then(
        ({ data }) => {
          this.setState({ data });
        },
        error => {
          this.setState({ error });
        },
      );
  }

  getDayLabel(day, i) {
    let label;

    if (i === 0) {
      label = CURRENT_DAY_LABEL;
    } else {
      const offset = oFetch(this.state, 'data.current.offset');
      const time = oFetch(day, 'time') * 1000 + offset * 60 * 60 * 1000;
      const date = new Date(time);
      const weekDay = date.getUTCDay();

      label = WEEK_DAY_LABELS[weekDay];
    }

    return label;
  }

  getDayValues(day, i) {
    let label = this.getDayLabel(day, i);
    let [icon, high, low, summary] = oFetch(day, 'icon', 'temperatureHigh', 'temperatureLow', 'summary');

    high = Math.round(high);
    low = Math.round(low);

    return { label, icon, high, low, summary };
  }

  render() {
    const { data, error } = this.state;

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    const [currently, daily] = oFetch(data, 'current.currently', 'current.daily.data');
    const hourly = oFetch(data, 'time.hourly.data');

    let dailyHighest = -Infinity;
    let dailyLowest = Infinity;

    daily.forEach(day => {
      const [high, low] = oFetch(day, 'temperatureHigh', 'temperatureLow');

      if (high > dailyHighest) {
        dailyHighest = high;
      }

      if (low < dailyLowest) {
        dailyLowest = low;
      }
    });

    dailyHighest = Math.round(dailyHighest);
    dailyLowest = Math.round(dailyLowest);

    const dayTimeline = [];

    hourly.forEach(hour => {
      const icon = oFetch(hour, 'icon');
      const summary = ICON_TO_CONDITION_TEXT[icon];

      if (dayTimeline.length && dayTimeline[dayTimeline.length - 1].summary === summary) {
        dayTimeline[dayTimeline.length - 1].hours += 1;
      } else {
        dayTimeline.push({
          icon: icon,
          summary: summary,
          hours: 1,
        });
      }
    });

    return (
      <div className="boss-weather">
        <div className="boss-weather__daily">
          <div className="boss-weather__summary">
            <div className="boss-weather__summary-primary">
              <div className="boss-weather__summary-temp">{Math.round(oFetch(currently, 'temperature'))}&deg;</div>
              <div className="boss-weather__summary-icon">
                <Skycons type={oFetch(currently, 'icon')} color="#4c4c4c" width="60" height="60" />
              </div>
            </div>
            <div className="boss-weather__summary-secondary">
              <h3 className="boss-weather__summary-title">{oFetch(currently, 'summary')}</h3>
              <p className="boss-weather__summary-text">{oFetch(daily, '0.summary')}</p>
            </div>
          </div>

          <div className="boss-weather__timeline">
            <div className="boss-weather__timeline-conditions">
              {dayTimeline.map((condition, i) => <WeatherCondition {...condition} key={i} />)}
            </div>
            <div className="boss-weather__timeline-intervals">
              {hourly.map((hour, i) => {
                return (
                  <div key={i} className="boss-weather__timeline-interval">
                    <div className="boss-weather__timeline-data">
                      <div className="boss-weather__timeline-hour">{i}</div>
                      <div className="boss-weather__timeline-temp">{Math.round(oFetch(hour, 'temperature'))}&deg;</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="boss-weather__weekly">
          <div className="boss-weather__forecast boss-weather__forecast_horizontal boss-weather__forecast_hidden-mobile">
            <div className="boss-weather__forecast-days">
              {daily.map((day, i) => {
                const { label, icon, high, low, summary } = this.getDayValues(day, i);

                return (
                  <ForecastDay
                    key={label + i}
                    direction="vertical"
                    label={label}
                    icon={icon}
                    high={high}
                    low={low}
                    highest={dailyHighest}
                    lowest={dailyLowest}
                    summary={summary}
                  />
                );
              })}
            </div>
          </div>

          <div className="boss-weather__forecast boss-weather__forecast_vertical boss-weather__forecast_visible-mobile">
            <div className="boss-weather__forecast-days">
              {daily.map((day, i) => {
                const { label, icon, high, low, summary } = this.getDayValues(day, i);

                return (
                  <ForecastDay
                    key={label + i}
                    direction="horizontal"
                    label={label}
                    icon={icon}
                    high={high}
                    low={low}
                    highest={dailyHighest}
                    lowest={dailyLowest}
                    summary={summary}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
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

  return (
    <div className="boss-weather__forecast-day">
      <div className="boss-weather__forecast-info">
        <p className="boss-weather__forecast-label">{label}</p>
        <div className="boss-weather__forecast-icon">
          <Skycons type={icon} color="#4c4c4c" width="40" height="40" title={summary} />
        </div>
      </div>
      <div className="boss-weather__forecast-temp">
        <div className="boss-weather__forecast-range" style={rangeStyle}>
          <p className="boss-weather__forecast-high">{high}&deg;</p>
          <div className="boss-weather__forecast-indicator" />
          <p className="boss-weather__forecast-low">{low}&deg;</p>
        </div>
      </div>
    </div>
  );
}

class WeatherCondition extends React.Component {
  state = {
    tooltipVisible: false,
  };

  onEnter = e => {
    // If pointing target is the label itself and not the text element
    if (e.target === e.currentTarget) {
      this.setState({ tooltipVisible: true });
    }
  };

  onLeave = e => {
    // If pointing target is the label itself and not the text element
    if (e.target === e.currentTarget) {
      this.setState({ tooltipVisible: false });
    }
  };

  render() {
    const { hours, summary, icon } = this.props;
    const { tooltipVisible } = this.state;

    const className = `boss-weather__timeline-condition boss-weather__timeline-condition_${
      ICON_TO_CONDITION_CLASS[icon]
    }`;

    return (
      <div
        className={className}
        style={{
          width: 100 / 24 * hours + '%',
        }}
      >
        <p className="boss-weather__timeline-label" onMouseEnter={this.onEnter} onMouseLeave={this.onLeave}>
          <span className="boss-weather__timeline-label_text">{summary}</span>
        </p>
        {tooltipVisible ? <div className="boss-weather__timeline-tooltip">{summary}</div> : null}
      </div>
    );
  }
}
