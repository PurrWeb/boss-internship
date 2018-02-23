import React from 'react';
import classnames from 'classnames';
import safeMoment from "~/lib/safe-moment";

import TaskFooter from '../shared/task-footer';
import StatusBadge from '../shared/status-badge';
import GrabButton from '../shared/grab-button';

export default class ArtworkTasks extends React.Component {
  componentDidMount() {
    let $panel = $(`.boss-check[data-task-id="${this.props.currentMarketingTask.id}"]`);

    $panel.each(function(){
      let panelDropdownIcon = $(this).find(".boss-check__dropdown-link");
      let panelDropdown = $(this).find(".boss-check__dropdown");
      let panelStatusLabel = $(this).find(".boss-check__cell_role_priority");

      function togglePanelDropdown(e) {
        e.preventDefault();
        panelDropdownIcon.toggleClass("boss-check__dropdown-link_state_closed");
        panelDropdown.slideToggle().toggleClass("boss-check__dropdown_state_closed");
      }

      panelDropdownIcon.on('click', togglePanelDropdown);
    });
  }

  renderSizes() {
    if (this.props.currentMarketingTask.size != 'other') return;

    return (
      <span>
        <div className="boss-check__info-row">
          <div className="boss-check__info-cell">
            <p className="boss-check__text">Height</p>
          </div>

          <div className="boss-check__info-cell">
            <p className="boss-check__text boss-check__text_role_primary">{ this.props.currentMarketingTask.heightCm } cm</p>
          </div>
        </div>

        <div className="boss-check__info-row">
          <div className="boss-check__info-cell">
            <p className="boss-check__text">Width</p>
          </div>

          <div className="boss-check__info-cell">
            <p className="boss-check__text boss-check__text_role_primary">{ this.props.currentMarketingTask.widthCm } cm</p>
          </div>
        </div>
      </span>
    );
  }

  renderTaskDescription() {
    let startTime = safeMoment.parse(new Date(this.props.currentMarketingTask.startTime), 'DD/MM/YYYY HH:mm').format('DD/MM/YYYY HH:mm');
    let days = this.props.currentMarketingTask.days.join(', ');
    let facebookAnnouncement = (this.props.currentMarketingTask.facebookAnnouncement) ? 'Yes' : 'No';
    let facebookCoverPage = (this.props.currentMarketingTask.facebookCoverPage) ? 'Yes' : 'No';
    let facebookBooster = (this.props.currentMarketingTask.facebookBooster) ? 'Yes' : 'No';
    let printResponse = (this.props.currentMarketingTask.print) ? this.props.currentMarketingTask.quantity : 'No';

    return (
      <div className="boss-check__info-table">
        <div className="boss-check__info-row">
          <div className="boss-check__info-cell">
            <p className="boss-check__text">Size</p>
          </div>

          <div className="boss-check__info-cell">
            <p className="boss-check__text boss-check__text_role_primary">{ this.props.currentMarketingTask.size }</p>
          </div>
        </div>

        { this.renderSizes() }

        <div className="boss-check__info-row">
          <div className="boss-check__info-cell">
            <p className="boss-check__text">Facebook Cover page</p>
          </div>

          <div className="boss-check__info-cell">
            <p className="boss-check__text boss-check__text_role_primary">{ facebookCoverPage }</p>
          </div>
        </div>

        <div className="boss-check__info-row">
          <div className="boss-check__info-cell">
            <p className="boss-check__text">Facebook Booster</p>
          </div>

          <div className="boss-check__info-cell">
            <p className="boss-check__text boss-check__text_role_primary">{ facebookBooster }</p>
          </div>
        </div>

        <div className="boss-check__info-row">
          <div className="boss-check__info-cell">
            <p className="boss-check__text">Facebook Announcement</p>
          </div>

          <div className="boss-check__info-cell">
            <p className="boss-check__text boss-check__text_role_primary">{ facebookAnnouncement }</p>
          </div>
        </div>

        <div className="boss-check__info-row">
          <div className="boss-check__info-cell">
            <p className="boss-check__text">Print</p>
          </div>
          <div className="boss-check__info-cell">
            <p className="boss-check__text boss-check__text_role_primary">{ printResponse }</p>
          </div>
        </div>
      </div>
    )
  }

  render() {
    let { ...props } = this.props;

    props = Object.assign(props, {
      taskType: 'artwork'
    });

    return (
      <div className="boss-check boss-check_role_panel boss-check_page_marketing-index" data-task-id={ this.props.currentMarketingTask.id }>
        <div className="boss-check__header">
          <div className="boss-check__header-info">
            <StatusBadge { ...this.props } />

            <div className="boss-check__header-group">
              <h3 className={ `boss-check__title ${ (this.props.currentMarketingTask.marketingTaskNotes.length) ? 'boss-check__title_indicator_notes' : '' }` }>
                { this.props.currentMarketingTask.title }
              </h3>

              <div className="boss-check__header-meta">
                <div className="boss-check__header-meta-item">
                  <p className="boss-check__text boss-check__text_role_meta boss-check__text_role_venue">
                    { this.props.currentMarketingTask.venue.name }
                  </p>
                </div>

                <div className="boss-check__header-meta-item">
                  <p className={ `boss-check__text boss-check__text_role_meta ${(this.props.currentMarketingTask.pastDue) ? 'boss-check__text_role_date-alert' : 'boss-check__text_role_date'}` }>
                    { safeMoment.uiDateParse(new Date(this.props.currentMarketingTask.dueAt)).format("DD/MM/YYYY") }
                  </p>
                </div>

                <div className="boss-check__header-meta-item">
                  <GrabButton { ...this.props} />
                </div>
              </div>
            </div>
          </div>

          <div className="boss-check__dropdown-link boss-check__dropdown-link_type_icon boss-check__dropdown-link_state_closed">
            Toggle Dropdown
          </div>
        </div>

        <div className="boss-check__dropdown boss-check__dropdown_state_closed">
          <div className="boss-check__row">
            { this.renderTaskDescription() }
          </div>

          <TaskFooter { ...props } />
        </div>
      </div>
    )
  }
}
