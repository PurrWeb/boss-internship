import React, { Component } from 'react';
import ContentWrapper from '~/components/content-wrapper';
import oFetch from 'o-fetch';
import safeMoment from '~/lib/safe-moment';
import utils from '~/lib/utils';
import AsyncButton from 'react-async-button';

class NotesList extends Component {
  static defaultProps = {
    pageSize: 1,
    notes: [],
    paginate: true,
  };

  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      notes: props.paginate
        ? props.notes.slice(0, props.pageSize)
        : props.notes,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState(state => ({
      notes: nextProps.notes.slice(0, state.notes.length + this.props.pageSize),
    }));
  }

  renderNotesList = notes => {
    return notes.map(note => {
      const noteProps = {
        id: oFetch(note, 'id'),
        title: oFetch(note, 'title'),
        text: oFetch(note, 'text'),
        creator: this.props.users.find(
          user => user.id === oFetch(note, 'createdByUserId'),
        ),
        createdAt: safeMoment
          .iso8601Parse(oFetch(note, 'createdAt'))
          .format(utils.commonDateFormat),
        priority: oFetch(note, 'priority'),
        venue: this.props.venues.find(
          venue => venue.id === oFetch(note, 'venueId'),
        ),
        active: oFetch(note, 'active'),
      };
      return React.cloneElement(this.props.noteRenderer(noteProps), {
        key: note.id.toString(),
      });
    });
  };

  _handelLoadMoreClick = () => {
    const limit = this.state.notes.length + this.props.pageSize;
    return this.props.onLoadMoreClick(limit);
  };

  renderLoadMore() {
    return (
      <div className="boss-page-main__actions boss-page-main__actions_postion_last">
        <AsyncButton
          onClick={this._handelLoadMoreClick}
          className="boss-button boss-button_primary"
          text="Load more ..."
        />
      </div>
    );
  }

  render() {
    const showLoadMore =
      this.props.paginate &&
      this.state.notes.length > 0 &&
      this.state.notes.length < this.props.totalCount;

    return (
      <ContentWrapper>
        {this.renderNotesList(this.state.notes)}
        {showLoadMore && this.renderLoadMore()}
      </ContentWrapper>
    );
  }
}

export default NotesList;
