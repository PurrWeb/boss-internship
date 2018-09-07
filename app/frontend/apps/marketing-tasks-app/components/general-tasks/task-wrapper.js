import React from 'react';
import classnames from 'classnames';
import safeMoment from "~/lib/safe-moment";
import oFetch from 'o-fetch';

import TaskFooter from '../shared/task-footer';
import StatusBadge from '../shared/status-badge';
import GrabButton from '../shared/grab-button';

export default class GeneralTasks extends React.Component {
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

  render() {
    let { ...props } = this.props;

    props = Object.assign(props, {
      taskType: 'general'
    });

    const currentMarketingTask = oFetch(this.props, 'currentMarketingTask');
    return (
      <div className="boss-check boss-check_role_panel boss-check_page_marketing-index" data-task-id={ this.props.currentMarketingTask.id }>
        <div className="boss-check__header">
          <div className="boss-check__header-info">
            <StatusBadge { ...this.props } />

            <div className="boss-check__header-group">
              <h3 className={ `boss-check__title ${ (currentMarketingTask.marketingTaskNotes.length) ? 'boss-check__title_indicator_notes' : '' }` }>
                { this.props.currentMarketingTask.title }
              </h3>

              <div className="boss-check__header-meta">
                <div className="boss-check__header-meta-item">
                  <p className="boss-check__text boss-check__text_role_meta boss-check__text_role_venue">
                    { currentMarketingTask.venue.name }
                  </p>
                </div>

                <div className="boss-check__header-meta-item">
                  <p className={ `boss-check__text boss-check__text_role_meta ${(this.props.currentMarketingTask.pastDue) ? 'boss-check__text_role_date-alert' : 'boss-check__text_role_date'}` }>
                    { safeMoment.iso8601Parse(oFetch(currentMarketingTask, 'dueAt')).format("DD/MM/YYYY") }
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
            <div className="boss-check__cell">
              <div className="boss-check__box">
                <p className="boss-check__text">
                  { this.props.currentMarketingTask.description }
                </p>
              </div>
            </div>
          </div>

          <TaskFooter { ...props } />
        </div>
      </div>
    )
  }
}
