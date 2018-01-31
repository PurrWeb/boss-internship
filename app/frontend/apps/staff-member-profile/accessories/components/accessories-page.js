import React from 'react';
import oFetch from 'o-fetch';

import { openContentModal, openWarningModal } from '~/components/modals';

import AccessoriesHeader from './accessories-header';
import AccessoriesContent from './accessories-content';
import NewAccessoryRequest from './new-accessory-request';
import AccessoryRequestsList from './accessory-requests-list';

class AccessoriesPage extends React.Component {
  handleNewRequestSubmit = (closeModal, values) => {
    const staffMemberId = oFetch(this.props.staffMember.toJS(), 'id');
    return this.props.actions
      .newAccessory({ staffMemberId, values })
      .then(resp => {
        closeModal();
        return resp;
      });
  };

  handleCancelRequestSubmit = (hideModal, values) => {
    return this.props.actions.cancelAccessory(values).then(response => {
      hideModal();
    });
  };

  handleCancelRequest = accessoryRequestId => {
    const staffMemberId = oFetch(this.props.staffMember.toJS(), 'id');
    openWarningModal({
      submit: this.handleCancelRequestSubmit,
      config: {
        title: 'WARNING !!!',
        text: 'Are You Sure, you want to cances accessory request?',
        buttonText: 'Cancel request',
      },
      props: { accessoryRequestId, staffMemberId },
    });
  };

  handleRefundRequest = accessoryRequestId => {
    const staffMemberId = oFetch(this.props.staffMember.toJS(), 'id');
    openWarningModal({
      submit: this.handleRefundRequestSubmit,
      config: {
        title: 'WARNING !!!',
        text: 'Are You Sure, you want to refund accessory request?',
        buttonText: 'Refund request',
      },
      props: { accessoryRequestId, staffMemberId },
    });
  };

  handleRefundRequestSubmit = (hideModal, values) => {
    return this.props.actions.refundAccessory(values).then(response => {
      hideModal();
    });
  };

  openNewRequestModal = () => {
    openContentModal({
      submit: this.handleNewRequestSubmit,
      props: {
        accessories: this.props.accessories,
      },
      config: { title: 'Add Request' },
    })(NewAccessoryRequest);
  };

  render() {
    return (
      <section className="boss-board">
        <AccessoriesHeader
          title="Accessories"
          onRequest={this.openNewRequestModal}
        />
        <AccessoriesContent>
          <AccessoryRequestsList
            accessoryRequests={this.props.accessoryRequests.toJS()}
            onAccessoryCancel={this.handleCancelRequest}
            onAccessoryRefund={this.handleRefundRequest}
          />
        </AccessoriesContent>
      </section>
    );
  }
}

export default AccessoriesPage;
