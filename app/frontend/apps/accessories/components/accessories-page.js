import React from 'react';
import URLSearchParams from 'url-search-params';
import oFetch from 'o-fetch';

import {
  SimpleDashboard,
  DashboardFilter,
  DashboardActions,
} from '~/components/boss-dashboards';

import { openWarningModal, openContentModal } from '~/components/modals';

import AccessoriesFilter from './accessories-filter';
import AddAccessory from './add-accessory';
import EditAccessory from './edit-accessory';
import AccessoriesList from './accessories-list';
import EditFreeItems from './edit-free-items';
import EditFreeItemsHistoryList from './edit-free-items-history-list';
import EditFreeItemsHistoryItem from './edit-free-items-history-item';

class AccessoriesPage extends React.Component {
  handleLoadMore = () => {
    this.props.actions.loadMoreClick();
  };

  handleAddAccessorySubmit = (hideModal, values) => {
    return this.props.actions.createAccessory(values).then(resp => {
      hideModal();
      return resp;
    });
  };

  handleEditAccessorySubmit = (hideModal, values) => {
    return this.props.actions.updateAccessory(values).then(resp => {
      hideModal();
      return resp;
    });
  };

  handleDisableAccessorySubmit = (hideModal, params) => {
    return this.props.actions.disableAccessory(params.accessory).then(resp => {
      hideModal();
      return resp;
    });
  };

  handleRestoreAccessorySubmit = (hideModal, params) => {
    return this.props.actions.restoreAccessory(params.accessory).then(resp => {
      hideModal();
      return resp;
    });
  };


  handleEditFreeItemsSubmit = (hideModal, values) => {
    return this.props.actions.updateAccessoryFreeItems(values).then(resp => {
      hideModal();
      return resp;
    });
  };

  handleEdit = accessory => {
    openContentModal({
      submit: this.handleEditAccessorySubmit,
      config: { title: 'Edit accessory' },
      props: { accessory: accessory },
    })(EditAccessory);
  };

  handleDisable = accessory => {
    openWarningModal({
      submit: this.handleDisableAccessorySubmit,
      config: {
        title: 'WARNING !!!',
        text: 'Are You Sure?',
        buttonText: 'Disable',
      },
      props: { accessory },
    });
  };

  handleRestore = accessory => {
    openWarningModal({
      submit: this.handleRestoreAccessorySubmit,
      config: {
        title: 'WARNING !!!',
        text: 'Are You Sure?',
        buttonText: 'Restore',
      },
      props: { accessory },
    });
  };

  handleAddAccessory = () => {
    openContentModal({
      submit: this.handleAddAccessorySubmit,
      config: { title: 'Add Accessory' },
    })(AddAccessory);
  };

  handleOpenHistory = accessory => {
    openContentModal({
      config: { title: `${oFetch(accessory, 'name')} History`, modalClassName: 'boss-modal-window_role_history' },
      props: { 
        accessoryHistory: oFetch(accessory, 'accessoryHistory'),
        itemRenderer: (historyItem) => {
          return <EditFreeItemsHistoryItem historyItem={historyItem} />
        } 
      },
    })(EditFreeItemsHistoryList);
  }

  handleEditFreeItems = accessory => {
    openContentModal({
      submit: this.handleEditFreeItemsSubmit,
      config: { title: `Edit ${oFetch(accessory, 'name')} Inventory` },
      props: { accessory, onOpenHistory: this.handleOpenHistory },
    })(EditFreeItems);
  };

  handleFilter = values => {
    const queryString = new URLSearchParams(window.location.search);
    queryString.delete('accessoryType');
    queryString.delete('status');
    queryString.delete('name');
    queryString.delete('userRequestable');
    for (let value in values) {
      if (values[value]) {
        queryString.set(value, values[value]);
      }
    }
    window.history.pushState('state', 'title', `accessories?${queryString}`);
    return this.props.actions.filter();
  };

  getAccessories() {
    const { accessories, pagination: { pageNumber, perPage } } = this.props;
    const slice = pageNumber * perPage;
    if (accessories.length) {
      return accessories.slice(0, slice);
    }
    return [];
  }

  render() {
    const accessories = this.getAccessories();
    const isShowLoadMore =
      accessories.length < this.props.pagination.totalCount;
    return (
      <div>
        <SimpleDashboard title="Accessories">
          <DashboardActions>
            <button
              className="boss-button boss-button_role_add"
              onClick={this.handleAddAccessory}
            >
              Add Accessory
            </button>
          </DashboardActions>
          <DashboardFilter
            onFilter={this.handleFilter}
            component={AccessoriesFilter}
          />
        </SimpleDashboard>
        <AccessoriesList
          accessories={this.getAccessories()}
          totalCount={this.props.pagination.totalCount}
          isShowLoadMore={isShowLoadMore}
          onRestore={this.handleRestore}
          onEdit={this.handleEdit}
          onDisable={this.handleDisable}
          onLoadMoreClick={this.handleLoadMore}
          onEditFreeItems={this.handleEditFreeItems}
        />
      </div>
    );
  }
}

export default AccessoriesPage;
