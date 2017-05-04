import React from 'react';
import classnames from 'classnames';

export default class Header extends React.Component {
  static displayName = 'Header';

  venueName() {
    return (this.props.currentVenue) ? _.capitalize(this.props.currentVenue.name) : '';
  }

  failedCategories() {
    if (!this.props.scores) return;

    let scores = this.props.scores.filter(score => { return !score.passed })
    let scoreIds = scores.map(score => {
      return score.questionnaire_category_id;
    });

    return this.props.categories.filter(category => {
      return scoreIds.includes(category.id);
    });
  }

  renderFailedCategories() {
    let failedCategories = this.failedCategories();

    if (!failedCategories) return;

    let failedCategoryNames = failedCategories.map(failedCategory => {
      return failedCategory.name
    });
    let failedCategoryTags = failedCategoryNames.map(categoryName => {
      return (
        <a className="boss-page-dashboard__meta-link">{ categoryName }</a>
      );
    });

    if (failedCategories.length) {
      return (
        <span>
          <span className="boss-page-dashboard__meta-text">
            Failed section:
          </span>

          { failedCategoryTags }
        </span>
      )
    } else {
      return (
        <span></span>
      )
    }
  }

  render() {
    return (
      <div className="boss-page-main__dashboard">
        <div className="boss-page-main__inner">
          <div className="boss-page-dashboard boss-page-dashboard_updated boss-page-dashboard_page_report">
            <div className="boss-page-dashboard__group">
              <h1 className="boss-page-dashboard__title">{this.venueName()} Health Check Report</h1>

              <div className="boss-page-dashboard__buttons-group boss-page-dashboard__buttons-group_desktop">
                <a href="#" className="boss-button boss-button_role_fail_reverse boss-page-dashboard__button">Fail</a>
              </div>
            </div>

            <div className="boss-page-dashboard__group">
              <div className="boss-page-dashboard__meta">
                <p className="boss-page-dashboard__meta-item  boss-page-dashboard__meta-item_role_user">
                  <span className="boss-page-dashboard__meta-text">Checked by </span>
                  <a className="boss-page-dashboard__meta-link boss-page-dashboard__meta-link_role_name" href="#">Liam Graham</a>
                </p>

                <p className="boss-page-dashboard__meta-item boss-page-dashboard__meta-item_role_date">
                  <span className="boss-page-dashboard__meta-text">2nd November 2016</span>
                </p>
              </div>

              <div className="boss-page-dashboard__buttons-group boss-page-dashboard__buttons-group_mobile">
                <a href="#" className="boss-button boss-button_role_fail_reverse boss-page-dashboard__button">Fail</a>
              </div>

              <div className="boss-page-dashboard__meta">
                <p className="boss-page-dashboard__meta-item">
                  { this.renderFailedCategories() }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
