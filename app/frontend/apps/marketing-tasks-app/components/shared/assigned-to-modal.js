import React from 'react';
import classnames from 'classnames';
import moment from 'moment';
import Select from 'react-select';
import Modal from 'react-modal';
import safeMoment from '~/lib/safe-moment';

import CreateAssignedTo from './assign-to-user/create';

export default class AssignedToModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      assignedTo: null
    }
  }

  componentWillMount() {
    let assignedToUser = this.props.selectedMarketingTask.assignedToUser;

    if (assignedToUser) {
      this.setState({ assignedTo: { id: assignedToUser.id, value: assignedToUser.name }});
    }
  }

  onClose() {
    this.props.setFrontendState({ showAssignedToModal: false });
    this.props.setSelectedMarketingTask(null);
  }

  handleAssignedToChange(option) {
    this.setState({ assignedTo: option })
  }

  marketingUsers() {
    return this.props.marketingTaskUsers.map((marketingTaskUser) => {
      return { id: marketingTaskUser.id, value: marketingTaskUser.name }
    });
  }

  renderOption(option) {
    return (
      <span className="Select-staff-member">
        <span className="Select-staff-member-info">
          <span className="Select-staff-member-name">{ option.value }</span>
        </span>
      </span>
    );
  }

  render() {
    let task = this.props.selectedMarketingTask;

    return (
      <Modal
        isOpen={ this.props.frontend.showAssignedToModal }
        className={{
          afterOpen: 'ReactModal__Content ReactModal__Content--after-open boss-modal-window boss-modal-window_role_action',
        }}
        onRequestClose={ this.onClose.bind(this) }
        contentLabel="ReactModalPortal"
      >
        <button type="button" className="boss-modal-window__close" onClick={ this.onClose.bind(this) }></button>

        <div className="boss-modal-window__header">
          Assign to
        </div>

        <div className="boss-modal-window__content">
          <div className="boss-modal-window__form">
            <CreateAssignedTo { ...this.props } />
          </div>
        </div>
      </Modal>
    )
  }
}
