import React from 'react';
import classnames from 'classnames';
import moment from 'moment';
import RotaDate from "~/lib/rota-date.js";

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
        <a className="boss-page-dashboard__meta-link" key={ categoryName }>{ categoryName }</a>
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

  renderUser() {
    if (!this.props.user) return;

    return (
      <p className="boss-page-dashboard__meta-item  boss-page-dashboard__meta-item_role_user">
        <span className="boss-page-dashboard__meta-text">Checked by </span>
        <a
          className="boss-page-dashboard__meta-link boss-page-dashboard__meta-link_role_name"
          href={ `/users/${this.props.user.id}` }
        >
          { this.props.user.name }
        </a>
      </p>
    );
  }

  renderDate() {
    if (!this.props.response) return;

    let sCreatedAt = this.props.response.created_at;
    if (!sCreatedAt) return;

    let dCreatedAtDate = new RotaDate({ shiftStartsAt: sCreatedAt}).getDateOfRota();

    return (
      <p className="boss-page-dashboard__meta-item boss-page-dashboard__meta-item_role_date">
        <span
          className="boss-page-dashboard__meta-text"
        >
          { moment(dCreatedAtDate).format('MMMM Do YYYY') }
        </span>
      </p>
    );
  }

  statusBadge(){
    if (this.failedCategories() === undefined) return;

    if (this.failedCategories().length > 0) {
      return <a href="#" className="boss-button boss-button_role_fail_reverse boss-page-dashboard__button">Fail</a>
    } else {
      return <a href="#" className="boss-button boss-button_role_success_reverse boss-page-dashboard__button">Pass</a>
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
                { this.statusBadge() }
              </div>
            </div>

            <div className="boss-page-dashboard__group">
              <div className="boss-page-dashboard__meta">
                { this.renderUser() }

                { this.renderDate() }
              </div>

              <div className="boss-page-dashboard__buttons-group boss-page-dashboard__buttons-group_mobile">
                { this.statusBadge() }
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
