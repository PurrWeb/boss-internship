import React from 'react';
import Modal from 'react-modal';
import ReactDOM from 'react-dom';
import modalDecorator from './modal-decorator';

class InfoModal extends React.Component {
  render() {
    const { show, title, text, onClose } = this.props;

    return (
      <Modal
        isOpen={show}
        contentLabel="Modal"
        className={{
          base: `ReactModal__Content boss-modal-window boss-modal-window_role_note`,
          afterOpen: 'ReactModal__Content--after-open',
        }}
      >
        <button onClick={onClose} className="boss-modal-window__close" />
        <div className="boss-modal-window__header boss-modal-window__header_info">{title}</div>
        <div className="boss-modal-window__content">
          <div className="boss-modal-window__message-block">
            <span className="boss-modal-window__message-text">{text}</span>
          </div>
        </div>
      </Modal>
    );
  }
}

function openInfoModal({ title = '', text = '' }, props = {}, onSubmit, onClose, wrapper) {
  ReactDOM.render(<InfoModal show={true} title={title} text={text} onClose={onClose} />, wrapper);
}

export default modalDecorator(openInfoModal);
