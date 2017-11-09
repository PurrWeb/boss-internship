import React from 'react';
import Modal from 'react-modal';
import safeMoment from '~/lib/safe-moment';
import utils from '~/lib/utils';

function BouncedModalGroup({text, className = '', children}) {
  return (
    <div className={`boss-overview__group ${className}`}>
      <h4 className="boss-overview__label">
        <span className="boss-overview__label-text">{text}</span>
      </h4>
      {children}
    </div>
  )
}

class BouncedEmailModal extends React.Component {
  static defaultProps = {
    email: "",
    reason: "",
    error_code: "",
    bounced_at: "",
    onCloseClick: () => {},
  }

  constructor(props) {
    super(props);

    this.state = {
      isOpen: true,
    }
  }

  onCloseClick = () => {
    this.setState({isOpen: false}, () => {
      this.props.onCloseClick();
    })
  }

  render() {
    const {
      email,
      reason,
      error_code,
      bounced_at,
      updated_at,
    } = this.props;

    const lastUpdate = safeMoment.iso8601Parse(updated_at).format(utils.humanDateFormatWithTime())
    const created = safeMoment.iso8601Parse(bounced_at).format(utils.humanDateFormatWithTime());

    return (
      <Modal
        isOpen={this.state.isOpen}
        contentLabel="Modal"
        className={{
          base: `ReactModal__Content boss-modal-window boss-modal-window_role_bounced-email`,
          afterOpen: 'ReactModal__Content--after-open',
        }}
      >
        <button onClick={this.onCloseClick} className="boss-modal-window__close-inner"></button>
        <div className="boss-modal-window__header">Bounced Email</div>
        <div className="boss-modal-window__content">
          <div className="boss-modal-window__overview">
            <div className="boss-overview">
              <BouncedModalGroup text="Email">
                <p className="boss-overview__text boss-overview__text_adjust_wrap">{email}</p>
              </BouncedModalGroup>
              <BouncedModalGroup text="Status">
                <p className="boss-overview__text">{error_code}</p>
              </BouncedModalGroup>
              <BouncedModalGroup text="Reason">
                <p className="boss-overview__text boss-overview__text_adjust_wrap">{reason}</p>
              </BouncedModalGroup>
              <BouncedModalGroup text="Activity" className="boss-overview__group_position_last">
                <ul className="boss-overview__activity">
                  <li className="boss-overview__activity-item boss-overview__activity-item_role_updated">
                    <p className="boss-overview__meta">
                      <span className="boss-overview__meta-label">Last update </span>
                      <span className="boss-overview__meta-date">{lastUpdate}</span>
                    </p>
                  </li>
                  <li className="boss-overview__activity-item boss-overview__activity-item_role_created">
                    <p className="boss-overview__meta">
                      <span className="boss-overview__meta-label">Created </span>
                      <span className="boss-overview__meta-date">{created}</span>
                    </p>
                  </li>
                </ul>
              </BouncedModalGroup>
            </div>
          </div>
        </div>
      </Modal>
    )
  }
}

export default (bouncedData = {}) => {
  const bodyFirst = document.body.firstChild;
  const wrapper = document.createElement('div');
  bodyFirst.parentNode.insertBefore(wrapper, bodyFirst);

  const close = () => {
    removeComponent();
  }

  const removeComponent = () => {
    ReactDOM.unmountComponentAtNode(wrapper);
    wrapper.remove();
  }

  ReactDOM.render(
    <BouncedEmailModal
      onCloseClick={close}
      email={bouncedData.email}
      error_code={bouncedData.error_code}
      reason={bouncedData.reason}
      bounced_at={bouncedData.bounced_at}
      updated_at={bouncedData.updated_at}
    />,
    wrapper
  );
}
