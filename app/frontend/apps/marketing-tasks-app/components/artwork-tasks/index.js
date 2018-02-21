import React from 'react';
import classnames from 'classnames';

import TaskWrapper from './task-wrapper';
import AddTaskButton from '../shared/add-task-button';

export default class ArtworkTasks extends React.Component {
  componentDidMount() {
    let $board = $(`.boss-board[data-section-name="ArtworkTask"]`);

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
    if (this.props.artworkTasks.length == 0) {
      return (
        <p className="boss-board__text-placeholder">No tasks to display</p>
      );
    }

    return this.props.artworkTasks.map((artworkTask) => {
      let props = { ...this.props }

      props = Object.assign(props, { currentMarketingTask: artworkTask});

      return <TaskWrapper { ...props } key={ artworkTask.id }/>;
    });
  }

  renderLoadMore() {
    let totalTasks = this.props.pagination.artworkTaskCount;
    let loadedTasks = this.props.artworkTasks.length;
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
    let props = Object.assign({ ...this.props }, { taskType: 'artwork' });

    return (
      <section className="boss-board boss-board_context_stack" data-section-name="ArtworkTask">
        <header className="boss-board__header boss-board__header_role_tasks-artwork">
          <h2 className="boss-board__title boss-board__title_role_tasks-artwork">Artwork</h2>

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
