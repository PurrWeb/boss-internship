import React from 'react';
import oFetch from 'o-fetch';

import {
  openContentModal,
  openWarningModal,
} from '~/components/modals';

import AccessoriesHeader from './accessories-header';
import AccessoriesContent from './accessories-content';
import NewAccessoryRequest from './new-accessory-request';
import AccessoryRequestsList from './accessory-requests-list';

class AccessoriesPage extends React.Component {

  handleNewRequestSubmit = (closeModal, values) => {
    const staffMemberId = oFetch(this.props.staffMember.toJS(), 'id');
    return this.props.actions.newAccessory({staffMemberId, values})
      .then(resp => {
        closeModal();
        return resp;
      })
  }

  openNewRequestModal = () => {
    openContentModal({
      submit: this.handleNewRequestSubmit,
      props: {
        accessories: this.props.accessories,
      },
      config: {title: 'Add Request'}
    })(NewAccessoryRequest)
  }

  render() {
    return (
      <section className="boss-board">
        <AccessoriesHeader title="Accessories" onRequest={this.openNewRequestModal}/>
        <AccessoriesContent>
          <AccessoryRequestsList accessoryRequests={this.props.accessoryRequests.toJS()} />
        </AccessoriesContent>
      </section>
    )
  }
}

export default AccessoriesPage;
