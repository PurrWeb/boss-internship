import React from 'react';
import classnames from 'classnames';

import IndexPage from './index-page';
import CreatePage from './create-page';
import UpdatePage from './update-page';
import Pagination from './pagination';

export default class PageBody extends React.Component {
  renderPageComponent() {
    let frontend = this.props.frontend;

    if (frontend.indexPage) {
      return (
        <IndexPage { ...this.props } />
      );
    } else if (frontend.createPage) {
      return (
        <CreatePage { ...this.props } />
      );
    } else if (frontend.updatePage) {
      return (
        <UpdatePage { ...this.props } />
      );
    }
  }

  render() {
    return(
      <div className="boss-page-main__content">
        { this.renderPageComponent() }

        { this.props.frontend.indexPage && <Pagination { ...this.props } /> }
      </div>
    );
  }
}
