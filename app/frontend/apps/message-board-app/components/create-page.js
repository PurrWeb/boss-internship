import React from 'react';
import classnames from 'classnames';

import CreateMessageBoard from './create-message-board';
import PreviewBox from './preview-box'

export default class CreatePage extends React.Component {
  render() {
    return(
      <div className="boss-page-main__inner boss-page-main__inner_opaque boss-page-main__inner_space_large">
        <section className="boss-board boss-board_context_stack boss-board_role_panel">
          <div className="boss-board__main">
            <div className="boss-board__message-form">
              <div className="boss-board__message-form-inner">
                <CreateMessageBoard { ...this.props } />
              </div>
            </div>
          </div>
        </section>

        <PreviewBox />
      </div>
    );
  }
}
