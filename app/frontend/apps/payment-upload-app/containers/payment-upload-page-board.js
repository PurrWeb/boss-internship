import React from 'react';
import oFetch from 'o-fetch';
import { Collapse } from 'react-collapse';

class PaymentUploadPageBoard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOpened: oFetch(this.props, 'isOpened')
    };
  }

  toggleDropDown = () => {
    this.setState(state => ({ isOpened: !state.isOpened }));
  };

  render(){
    const isOpened = oFetch(this.state, 'isOpened')
    const statusClass = oFetch(this.props, 'statusClass');
    const count = oFetch(this.props, 'count');
    const title = oFetch(this.props, 'title');
    const switchClass = isOpened ? 'boss-board__switch_state_opened' : '';
    const boardContentClass = isOpened ? 'board__content_state_opened' : '';

    return <section  className="boss-board boss-board_context_stack">
      <header className="boss-board__header">
        <div className={`boss-indicator ${statusClass} boss-board__indicator`}>
          <span className="boss-indicator__marker">{ count }</span>
        </div>
        <h2 className="boss-board__title boss-board__title_size_medium">{ title }</h2>
        <div className="boss-board__button-group">
          <button onClick={this.toggleDropDown} type="button" className={`boss-board__switch ${switchClass}`}></button>
        </div>
      </header>

      <div className={`boss-board__content ${boardContentClass}`} style={ {display: 'block'} }>
      <Collapse
        isOpened={this.state.isOpened}
        className="boss-check__dropdown"
        style={{ display: 'block' }}
        >
          <div className="boss-board__content-inner">
            {this.props.children}
          </div>
      </Collapse>
      </div>
    </section>;
  }
}

export default PaymentUploadPageBoard;
