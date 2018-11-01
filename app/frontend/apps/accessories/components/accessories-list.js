import React from 'react';
import oFetch from 'o-fetch';
import numeral from 'numeral';
import ContentWrapper from '~/components/content-wrapper';

import {
  BossCheckCard,
  BossCheckCardRow,
  BossCheckCardActions,
  BossCheckSimpleRow,
} from '~/components/boss-check-card';

import * as accessoriesConstants from './constants';
import AccessoriesInventoryCell from './accessories-inventory-cell';

class AccessoriesList extends React.Component {
  renderEnabledButtons(accessory) {
    const canEdit = oFetch(this.props, 'permissions.edit');
    const canDisable = oFetch(this.props, 'permissions.disable');
    return (
      <BossCheckCardActions>
        {canEdit && <button className="boss-button boss-button_role_edit" onClick={() => this.props.onEdit(accessory)}>
          Edit
        </button>}
        {canDisable && <button className="boss-button boss-button_role_disable" onClick={() => this.props.onDisable(accessory)}>
          Disable
        </button>}
      </BossCheckCardActions>
    );
  }

  renderDisabledButtons(accessory) {
    const canEnable = oFetch(this.props, 'permissions.enable');

    return (
      <BossCheckCardActions>
        {canEnable && <button className="boss-button boss-button_role_restore" onClick={() => this.props.onRestore(accessory)}>
          Restore
        </button>}
      </BossCheckCardActions>
    );
  }

  getSizes(sizesString) {
    if (sizesString === null) {
      return 'N/A';
    }
    return sizesString
      .split(',')
      .map(size => {
        return size.toUpperCase();
      })
      .join(', ');
  }

  renderAccessories(accessories) {
    const canInventory = oFetch(this.props, 'permissions.inventory');

    return accessories.map((accessory, index) => {
      const price = numeral(oFetch(accessory, 'priceCents') / 100).format('0,0.00');
      const isEnabled = oFetch(accessory, 'enabled');
      const pendingRefundCount = oFetch(accessory, 'pendingRefundCount');
      const pendingRequestCount = oFetch(accessory, 'pendingRequestCount');
      const onEditFreeItems = oFetch(this.props, 'onEditFreeItems');
      return (
        <BossCheckCard
          key={index}
          title={`${oFetch(accessory, 'name')}`}
          status={`${!isEnabled ? ' (Disabled)' : ''}`}
          className="boss-check__title_role_accessory"
        >
          <BossCheckCardRow title="Price" text={`£${price}`} />
          <BossCheckCardRow
            title="Type"
            text={accessoriesConstants.ACCESSORY_TYPE_LABELS[oFetch(accessory, 'accessoryType')]}
          />
          <BossCheckCardRow title="Size" text={this.getSizes(oFetch(accessory, 'size'))} />
          <BossCheckCardRow title="Self requestable" text={oFetch(accessory, 'userRequestable') ? 'Yes' : 'No'} />
          <BossCheckCardRow title="Current requests" text={pendingRequestCount} />
          <BossCheckCardRow title="Current refunds" text={pendingRefundCount} />
          <BossCheckSimpleRow>
            {canInventory ? (
              <AccessoriesInventoryCell
                title="Free Items"
                count={oFetch(accessory, 'freeItems')}
                actionRenderer={() => {
                  return (
                    <button onClick={() => onEditFreeItems(accessory)} className="boss-check__link">
                      <span className="boss-check__text boss-check__text_role_edit boss-check__text_role_link">Edit</span>
                    </button>
                  );
                }}
              />) : (
                <AccessoriesInventoryCell
                  title="Free Items"
                  count={oFetch(accessory, 'freeItems')}
                />
              )}
            <AccessoriesInventoryCell title="Booked Items" count={oFetch(accessory, 'booked')} />
            <AccessoriesInventoryCell title="Refunds" count={oFetch(accessory, 'refunded')} />
          </BossCheckSimpleRow>
          {isEnabled ? this.renderEnabledButtons(accessory) : this.renderDisabledButtons(accessory)}
        </BossCheckCard>
      );
    });
  }

  render() {
    return (
      <ContentWrapper>
        {this.renderAccessories(this.props.accessories)}
        {!!this.props.accessories.length && (
          <div className="boss-page-main__count boss-page-main__count_space_large">
            <span className="boss-page-main__count-text">Showing </span>
            <span className="boss-page-main__count-text boss-page-main__count-text_marked">
              {this.props.accessories.length}
            </span>
            <span className="boss-page-main__count-text"> of </span>
            <span className="boss-page-main__count-text boss-page-main__count-text_marked">
              {this.props.totalCount}
            </span>
          </div>
        )}
        {this.props.isShowLoadMore && (
          <div className="boss-page-main__actions boss-page-main__actions_position_last">
            <button
              onClick={this.props.onLoadMoreClick}
              className="boss-button boss-button_role_load-more boss-button_adjust_full-mobile"
            >
              Load more
            </button>
          </div>
        )}
      </ContentWrapper>
    );
  }
}

export default AccessoriesList;
