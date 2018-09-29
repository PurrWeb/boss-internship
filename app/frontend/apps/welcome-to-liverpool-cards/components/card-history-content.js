import React from 'react';
import oFetch from 'o-fetch';
import safeMoment from '~/lib/safe-moment';
import utils from '~/lib/utils';
import Spinner from '~/components/spinner';

import { ASSIGNED, REGISTERED, UNASSIGNED, UPDATE, CREATED, HISTORY_EVENTS_MAP } from '../constants';
import LoadMore from '~/components/load-more/load-more-children';
import { fetchWtlCardHistoryRequest } from '../requests';
class CardHistoryContent extends React.PureComponent {
  state = {
    fetching: true,
    history: {},
  };

  componentDidMount = async () => {
    const card = oFetch(this.props, 'card');
    const response = await fetchWtlCardHistoryRequest(card);
    const history = oFetch(response, 'data.history');
    this.setState({ fetching: false, history });
  };

  renderHistory(history) {
    return history.map(historyItem => {
      const [date, event, by, to, changeset] = oFetch(historyItem, 'date', 'event', 'by', 'to', 'changeset');
      if (event === CREATED) {
        const number = oFetch(changeset, 'number');
        return (
          <li key={date} className="boss-overview__activity-item">
            <p className="boss-overview__text">
              <span className="boss-overview__text-marked">
                {safeMoment.iso8601Parse(date).format(utils.humanDateFormatWithDayOfWeek())}
              </span>
              <span className="boss-overview__text-faded"> {HISTORY_EVENTS_MAP[event]} </span>
              <span className="boss-overview__text-faded"> by </span>
              <span className="boss-overview__text-marked">{by}</span>
              <span className="boss-overview__text-faded"> with number </span>
              <span className="boss-overview__text-marked">{number[1]}</span>
            </p>
          </li>
        );
      }
      if (event === UPDATE) {
        const state = oFetch(changeset, 'state');
        return (
          <li key={date} className="boss-overview__activity-item">
            <p className="boss-overview__text">
              <span className="boss-overview__text-marked">
                {safeMoment.iso8601Parse(date).format(utils.humanDateFormatWithDayOfWeek())}
              </span>
              <span className="boss-overview__text-faded"> {HISTORY_EVENTS_MAP[event]} </span>
              <span className="boss-overview__text-faded"> by </span>
              <span className="boss-overview__text-marked">{by}</span>
              <span className="boss-overview__text-faded"> from </span>
              <span className="boss-overview__text-marked">{state[0]}</span>
              <span className="boss-overview__text-faded"> to </span>
              <span className="boss-overview__text-marked">{state[1]}</span>
            </p>
          </li>
        );
      }
      return (
        <li key={date} className="boss-overview__activity-item">
          <p className="boss-overview__text">
            <span className="boss-overview__text-marked">
              {safeMoment.iso8601Parse(date).format(utils.humanDateFormatWithDayOfWeek())}
            </span>
            <span className="boss-overview__text-faded"> {HISTORY_EVENTS_MAP[event]} </span>
            {(event === ASSIGNED || event === REGISTERED) && <span className="boss-overview__text-faded"> to </span>}
            <span className="boss-overview__text-marked">{to}</span>
            {(event === UNASSIGNED || event === ASSIGNED) && <span className="boss-overview__text-faded"> by </span>}
            <span className="boss-overview__text-marked">{by}</span>
          </p>
        </li>
      );
    });
  }

  render() {
    if (this.state.fetching) {
      return <Spinner />;
    }

    const history = oFetch(this.state, 'history');

    const historyArray = Object.keys(history)
      .map(date => ({ ...history[date], date }))
      .sort((a, b) => {
        const mA = safeMoment.iso8601Parse(a.date);
        const mB = safeMoment.iso8601Parse(b.date);
        return mB - mA;
      });
    return (
      <LoadMore items={historyArray}>
        {({ visibleItems, onLoadMore }) => (
          <div className="boss-modal-window__overview">
            <div className="boss-overview">
              <div className="boss-overview__group">
                <ul className="boss-overview__activity">{this.renderHistory(visibleItems)}</ul>
              </div>
              {visibleItems.length !== historyArray.length && (
                <div className="boss-overview__group boss-overview__group_position_last">
                  <button onClick={onLoadMore} className="boss-button boss-button_type_small boss-button_primary-light">
                    Load More
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </LoadMore>
    );
  }
}

export default CardHistoryContent;
