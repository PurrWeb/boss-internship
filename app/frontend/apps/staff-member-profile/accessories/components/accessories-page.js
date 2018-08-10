import React from 'react';
import oFetch from 'o-fetch';

import { openContentModal, openWarningModal } from '~/components/modals';

import AccessoriesHeader from './accessories-header';
import AccessoriesContent from './accessories-content';
import NewAccessoryRequest from './new-accessory-request';
import AccessoryRequestsList from './accessory-requests-list';
import AccessoryRequestItem from './accessory-request-item';
import AccessoriesFilter from './accessories-filter';
import EditAccessoryRequest from './edit-accessory-request';

import { appRoutes } from '~/lib/routes';

class AccessoriesPage extends React.Component {
  handleNewRequestSubmit = (closeModal, values) => {
    const staffMemberId = oFetch(this.props.staffMember.toJS(), 'id');
    return this.props.actions.newAccessory({ staffMemberId, values }).then(resp => {
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
        text: 'Are you sure you want to request a refund?',
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

  handleEditPayslipDateSubmit = (hideModal, values) => {
    return this.props.actions.editAccessoryRequestPayslipDate(values).then(response => {
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

  openEditPayslipDateModal = accessoryRequest => {
    openContentModal({
      submit: this.handleEditPayslipDateSubmit,
      props: {
        accessoryRequest,
      },
      config: { title: 'Edit Payslip Date' },
    })(EditAccessoryRequest);
  };

  handleFilter = ({ mPayslipStartDate, mPayslipEndDate }) => {
    const staffMemberId = oFetch(this.props.staffMember.toJS(), 'id');

    const webGetUrl = appRoutes.staffMemberAccessories({
      staffMemberId,
      mPayslipStartDate,
      mPayslipEndDate,
    });
    window.history.pushState('state', 'title', `${webGetUrl}`);
    return this.props.actions.filter({ mPayslipStartDate, mPayslipEndDate, staffMemberId });
  };

  render() {
    const [mPayslipStartDate, mPayslipEndDate] = oFetch(this.props, 'mPayslipStartDate', 'mPayslipEndDate');
    return (
      <section className="boss-board">
        <AccessoriesHeader title="Accessories" onRequest={this.openNewRequestModal} />
        <AccessoriesContent>
          <AccessoriesFilter
            mPayslipStartDate={mPayslipStartDate}
            mPayslipEndDate={mPayslipEndDate}
            onFilter={this.handleFilter}
          />
          <AccessoryRequestsList
            accessoryRequests={this.props.accessoryRequests.toJS()}
            accessoryRequestRendered={accessoryRequest => (
              <AccessoryRequestItem
                onAccessoryCancel={this.handleCancelRequest}
                onAccessoryRefund={this.handleRefundRequest}
                accessoryRequest={accessoryRequest}
                onEditPayslipDate={this.openEditPayslipDateModal}
              />
            )}
          />
        </AccessoriesContent>
      </section>
    );
  }
}

export default AccessoriesPage;
