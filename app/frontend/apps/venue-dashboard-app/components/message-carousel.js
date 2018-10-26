import React from 'react';
import moment from 'moment';

export default class MessageCarousel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentMessage: props.messages[0],
    };
  }

  lastMessage(message) {
    let messages = this.props.messages;

    return !!messages.length && messages[messages.length - 1].id === message.id;
  }

  firstMessage(message) {
    let messages = this.props.messages;

    return !!messages.length && messages[0].id === message.id;
  }

  renderPreviousButton() {
    if (this.lastMessage(this.state.currentMessage)) {
      return null;
    }
    return (
      <button
        className="boss-button boss-button_role_previous boss-message__meta-action"
        onClick={this.handlePreviousClick}
      >
        See Previous
      </button>
    );
  }

  handlePreviousClick = () => {
    let index = this.props.messages.indexOf(this.state.currentMessage);

    this.setState({ currentMessage: this.props.messages[index + 1] });
  };

  handleNextClick = () => {
    let index = this.props.messages.indexOf(this.state.currentMessage);

    this.setState({ currentMessage: this.props.messages[index - 1] });
  };

  renderNextButton() {
    if (this.firstMessage(this.state.currentMessage)) {
      return null;
    }
    return (
      <button className="boss-button boss-button_role_next boss-message__meta-action" onClick={this.handleNextClick}>
        See Next
      </button>
    );
  }

  render() {
    if (!this.props.messages.length) return null;

    return (
      <div className="boss-message boss-message_role_dashboard boss-message_type_accent boss-message_context_board">
        <h2 className="boss-message__title boss-message__title_accent">{this.state.currentMessage.title}</h2>
        <div
          className="boss-message__content"
          dangerouslySetInnerHTML={{ __html: this.state.currentMessage.message }}
        />

        <div className="boss-message__meta">
          <div className="boss-message__meta-group">
            <p className="boss-message__meta-text">
              ( Created {moment(this.state.currentMessage.createdAt).format('DD/MM/YYYY')} )
            </p>

            <div className="boss-message__meta-actions">
              {this.renderNextButton()}
              {this.renderPreviousButton()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
