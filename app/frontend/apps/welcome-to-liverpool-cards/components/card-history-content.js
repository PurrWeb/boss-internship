import React from 'react';
import fixtures from '../fixtures';
import oFetch from 'o-fetch';
import safeMoment from '~/lib/safe-moment';
import utils from '~/lib/utils';
import { ASSIGNED, REGISTERED, UNASSIGNED } from '../constants';
import LoadMore from '~/components/load-more/load-more-children';

class CardHistoryContent extends React.Component {
  state = {
    history: [],
  };

  componentDidMount = () => {
    const card = oFetch(this.props, 'card');

    this.setState({
      history: fixtures.history,
    });
  };

  renderHistory(history) {
    return history.map(historyItem => {
      const [date, type, by, to] = oFetch(historyItem, 'date', 'type', 'by', 'to');
      return (
        <li key={date} className="boss-overview__activity-item">
          <p className="boss-overview__text">
            <span className="boss-overview__text-marked">
              {safeMoment.iso8601Parse(date).format(utils.humanDateFormatWithDayOfWeek())}
            </span>
            <span className="boss-overview__text-faded">{type}</span>
            {(type === ASSIGNED || type === REGISTERED) && <span className="boss-overview__text-faded">to</span>}
            <span className="boss-overview__text-marked">{to}</span>
            {type === UNASSIGNED && <span className="boss-overview__text-faded">by</span>}
            <span className="boss-overview__text-marked">{by}</span>
          </p>
        </li>
      );
    });
  }

  render() {
    const history = oFetch(this.state, 'history');

    return (
      <LoadMore items={history}>
        {({ visibleItems, onLoadMore }) => (
          <div className="boss-modal-window__overview">
            <div className="boss-overview">
              <div className="boss-overview__group">
                <ul className="boss-overview__activity">{this.renderHistory(visibleItems)}</ul>
              </div>
              <div className="boss-overview__group boss-overview__group_position_last">
                <button onClick={onLoadMore} className="boss-button boss-button_type_small boss-button_primary-light">
                  Load More
                </button>
              </div>
            </div>
          </div>
        )}
      </LoadMore>
    );
  }
}

export default CardHistoryContent;
