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
import { fetchClientHistory } from '../requests';
import safeMoment from '~/lib/safe-moment';
import utils from '~/lib/utils';

class ProfilePage extends React.Component {
  state = {
    loading: false,
    historyList: [],
    filteredHistoryList: [],
  };

  async componentDidMount() {
    const client = oFetch(this.props, 'client');
    if (!client) {
      return;
    }
    this.setState({ loading: true });

    try {
      const response = await fetchClientHistory({ id: oFetch(client, 'id') });
      const historyList = oFetch(response, 'data.history');
      this.setState({
        historyList,
        filteredHistoryList: historyList,
        loading: false,
      });
    } catch (error) {
      this.setState({
        loading: false,
      });
    }
  }

  renderLoader() {
    return (
      <section className="boss-board">
        <div className="boss-spinner" />
      </section>
    );
  }

  handleFilter = (startDate, endDate) => {
    if (startDate && endDate) {
      const mStartDate = safeMoment.uiDateParse(startDate);
      const mEndDate = safeMoment.uiDateParse(endDate);
      const filteredHistoryList = this.state.historyList.filter(historyItem => {
        const mDate = safeMoment.iso8601Parse(historyItem.date);
        return mDate.isSameOrAfter(mStartDate) && mDate.isSameOrBefore(mEndDate);
      });
      this.setState({ filteredHistoryList });
    } else {
      this.setState({ filteredHistoryList: this.state.historyList });
    }
  };

  render() {
    const [client, enadleClientRequested, disableClientRequested] = oFetch(
      this.props,
      'client',
      'enadleClientRequested',
      'disableClientRequested',
    );
    if (!client) {
      return <NotFound />;
    }
    const [loading, filteredHistoryList] = oFetch(this.state, 'loading', 'filteredHistoryList');
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
              enadleClientRequested={enadleClientRequested}
              disableClientRequested={disableClientRequested}
            />
            <ProfileHistory>
              <ProfileHistoryFilter onFilter={this.handleFilter} />
              {loading ? (
                this.renderLoader()
              ) : (
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
              )}
            </ProfileHistory>
          </div>
        </div>
      </main>
    );
  }
}

ProfilePage.propTypes = {
  client: PropTypes.object,
  enadleClientRequested: PropTypes.func.isRequired,
  disableClientRequested: PropTypes.func.isRequired,
};

export default withRouter(ProfilePage);
