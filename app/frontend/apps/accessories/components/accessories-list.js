import React from 'react';
import oFetch from 'o-fetch';
import numeral from 'numeral';
import ContentWrapper from '~/components/content-wrapper';

import {
  BossCheckCard,
  BossCheckCardRow,
  BossCheckCardActions
} from '~/components/boss-check-card';

import * as accessoriesConstants from './constants';

class AccessoriesList extends React.Component {
  renderEnabledButtons(accessory) {
    return (
      <BossCheckCardActions>
        <button
          className="boss-button boss-button_role_edit"
          onClick={() => this.props.onEdit(accessory)}
        >Edit</button>
        <button
          className="boss-button boss-button_role_disable"
          onClick={() => this.props.onDisable(accessory)}
        >Disable</button>
      </BossCheckCardActions>
    )
  }

  renderDisabledButtons(accessory) {
    return (
      <BossCheckCardActions>
        <button
          className="boss-button boss-button_role_restore"
          onClick={() => this.props.onRestore(accessory)}
        >Restore</button>
      </BossCheckCardActions>
    )
  }

  getSizes(sizesString) {
    if (sizesString === null) {return 'N/A'}
    return sizesString.split(',').map(size => {
      return size.toUpperCase();
    }).join(', ');
  }

  renderAccessories(accessories) {
    return accessories.map((accessory, index) => {
      const price = numeral(oFetch(accessory, 'priceCents') / 100).format('0,0.00');
      const isEnabled = oFetch(accessory, 'enabled');
      return (
        <BossCheckCard
          key={index}
          title={`${oFetch(accessory, 'name')}`}
          status={`${!isEnabled ? ' (Disabled)' : ''}`}
          className="boss-check__title_role_accessory"
        >
          <BossCheckCardRow title="Price" text={`£${price}`} />
          <BossCheckCardRow title="Type" text={accessoriesConstants.ACCESSORY_TYPE_LABELS[oFetch(accessory, 'accessoryType')]} />
          <BossCheckCardRow title="Size" text={this.getSizes(oFetch(accessory, 'size'))} />
          <BossCheckCardRow title="Self requestable" text={oFetch(accessory, 'userRequestable') ? 'Yes' : 'No'} />
          <BossCheckCardRow title="Current requests" text={0} />
          <BossCheckCardRow title="Current refunds" text={0} />
          { isEnabled
              ? this.renderEnabledButtons(accessory)
              : this.renderDisabledButtons(accessory)
          }
        </BossCheckCard>
      )
    })
  }

  render() {
    return (
      <ContentWrapper>
        { this.renderAccessories(this.props.accessories) }
        { !!this.props.accessories.length && <div className="boss-page-main__count boss-page-main__count_space_large">
          <span className="boss-page-main__count-text">Showing </span>
          <span className="boss-page-main__count-text boss-page-main__count-text_marked">{this.props.accessories.length}</span>
          <span className="boss-page-main__count-text"> of </span>
          <span className="boss-page-main__count-text boss-page-main__count-text_marked">{this.props.totalCount}</span>
        </div> }
        { this.props.isShowLoadMore && <div className="boss-page-main__actions boss-page-main__actions_position_last">
          <button
            onClick={this.props.onLoadMoreClick}
            className="boss-button boss-button_role_load-more boss-button_adjust_full-mobile"
          >Load more</button>
        </div> }
      </ContentWrapper>
    );
  }
}

export default AccessoriesList;
