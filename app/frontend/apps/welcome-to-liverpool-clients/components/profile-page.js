import React from 'react';
import PropTypes from 'prop-types';
import oFetch from 'o-fetch';
import { withRouter } from 'react-router-dom';
import { SimpleDashboard, DashboardActions } from '~/components/boss-dashboards';
import ProfileCard from './profile-card';
import ProfileHistory from './profile-history';
import ProfileHistoryFilter from './profile-history-filter';
import ProfileHistoryList from './profile-history-list';
import ProfileHistoryItem from './profile-history-item';
import NotFound from './not-found';
import LoadMore from '~/components/load-more/load-more-children';
import safeMoment from '~/lib/safe-moment';

class ProfilePage extends React.PureComponent {
  state = {
    startDate: null,
    endDate: null,
  };

  handleFilter = (startDate, endDate) => {
    this.setState({ startDate, endDate });
  };

  getFilteredHistory = () => {
    const { startDate, endDate } = this.state;
    const history = oFetch(this.props, 'client.history');
    const historyArray = Object.keys(history)
      .map(date => ({ ...history[date], date }))
      .sort((a, b) => {
        const mA = safeMoment.iso8601Parse(a.date);
        const mB = safeMoment.iso8601Parse(b.date);
        return mB - mA;
      });
    if (startDate && endDate) {
      const mStartDate = safeMoment
        .uiDateParse(startDate)
        .clone()
        .hours(0);
      const mEndDate = safeMoment
        .uiDateParse(endDate)
        .clone()
        .add(1, 'd')
        .hours(0);
      const filteredHistoryList = historyArray.filter(historyItem => {
        const mDate = safeMoment.iso8601Parse(historyItem.date);
        return mDate.isSameOrAfter(mStartDate) && mDate.isBefore(mEndDate);
      });
      return filteredHistoryList;
    } else {
      return historyArray;
    }
  };

  render() {
    const [client, enableClientRequested, disableClientRequested] = oFetch(
      this.props,
      'client',
      'enableClientRequested',
      'disableClientRequested',
    );
    if (!client) {
      return <NotFound />;
    }
    const filteredHistoryList = this.getFilteredHistory();
    const disabled = oFetch(client, 'disabled');
    return (
      <main className="boss-page-main">
        <SimpleDashboard
          title={
            <span>
              Welcome to Liverpool Client Profile&nbsp;{disabled && (
                <span className="boss-page-dashboard__title-text boss-page-dashboard__title-text_faded">
                  ( Disabled )
                </span>
              )}
            </span>
          }
        >
          <DashboardActions>
            <button
              onClick={() => this.props.history.goBack()}
              className="boss-button boss-button_role_primary boss-page-dashboard__button"
            >
              Return to Index
            </button>
          </DashboardActions>
        </SimpleDashboard>
        <div className="boss-page-main__content">
          <div className="boss-page-main__inner">
            <ProfileCard
              client={client}
              enableClientRequested={enableClientRequested}
              disableClientRequested={disableClientRequested}
              history={this.props.history}
            />
            <ProfileHistory>
              <ProfileHistoryFilter onFilter={this.handleFilter} />
              <LoadMore items={filteredHistoryList}>
                {({ visibleItems, onLoadMore }) => (
                  <ProfileHistoryList
                    total={filteredHistoryList.length}
                    historyList={visibleItems}
                    onLoadMore={onLoadMore}
                    itemRenderer={historyItem => <ProfileHistoryItem historyItem={historyItem} />}
                  />
                )}
              </LoadMore>
            </ProfileHistory>
          </div>
        </div>
      </main>
    );
  }
}

ProfilePage.propTypes = {
  client: PropTypes.object,
  enableClientRequested: PropTypes.func.isRequired,
  disableClientRequested: PropTypes.func.isRequired,
};

export default withRouter(ProfilePage);
