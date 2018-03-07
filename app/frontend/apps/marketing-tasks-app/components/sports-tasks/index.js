import React from 'react';
import classnames from 'classnames';
import oFetch from 'o-fetch';

import TaskWrapper from './task-wrapper';
import AddTaskButton from '../shared/add-task-button';

export default class SportsTasks extends React.Component {
  componentDidMount() {
    let $board = $(`.boss-board[data-section-name="SportsTask"]`);

    $board.each(function(){
      let boardSwitch = $(this).find('.boss-board__switch');
      let boardContent = $(this).find('.boss-board__content');

      function toggleBoard(e) {
        e.preventDefault();

        boardSwitch.toggleClass('boss-board__switch_state_opened');
        boardContent.slideToggle().end().toggleClass('boss-board__content_state_opened');
      }

      boardSwitch.on('click', toggleBoard);
    });
  }

  renderTasks() {
    if (this.props.musicTasks.length == 0) {
      return (
        <p className="boss-board__text-placeholder">No tasks to display</p>
      );
    }

    return this.props.sportsTasks.map((sportsTask) => {
      let props = { ...this.props }

      props = Object.assign(props, { currentMarketingTask: sportsTask});

      return <TaskWrapper { ...props } key={ sportsTask.id }/>;
    });
  }

  renderLoadMore() {
    let totalTasks = this.props.pagination.sportsTaskCount;
    let loadedTasks = this.props.sportsTasks.length;
    let currentPage = Math.ceil(loadedTasks / 5);
    let totalPages = Math.ceil(totalTasks / 5);

    if (currentPage == totalPages || totalPages == 0) return;

    return (
      <div className="boss-board__actions">
        <button
          className="boss-button boss-button_primary-light"
          onClick={ this.handleLoadMoreClick.bind(this, currentPage + 1) }
        >Load More</button>
      </div>
    );
  }

  handleLoadMoreClick(nextPage) {
    let props = Object.assign(this.props.filter, {
      page: nextPage,
    });

    this.props.queryPaginatedMarketingTasks(props)
  }

  render() {
    let props = Object.assign({ ...this.props }, { taskType: 'sports' });

    return (
      <section className="boss-board boss-board_context_stack" data-section-name="SportsTask">
        <header className="boss-board__header boss-board__header_role_tasks-sports">
          <h2 className="boss-board__title boss-board__title_role_tasks-sports">Sports</h2>

          <div className="boss-board__button-group">
            <AddTaskButton { ...props } />
            <button className="boss-board__switch boss-board__switch_type_angle boss-board__switch_state_opened" type="button"></button>
          </div>
        </header>

        <div className="boss-board__content boss-board__content_state_opened">
          <div className="boss-board__inner">
            <div className="boss-board__tasks">
              { this.renderTasks() }
            </div>

            { this.renderLoadMore() }
          </div>
        </div>
      </section>
    )
  }
}
