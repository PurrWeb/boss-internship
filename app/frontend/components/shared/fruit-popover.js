import React from "react"

export default class FruitPopover extends React.Component {
  renderAcceptedView() {
    if (!this.props.fruit_order_accepted) return;

    return (
      <li className="boss-order-summary__status-item boss-order-summary__status-item_role_accepted">
        <p className="boss-order-summary__meta">
          <span className="boss-order-summary__meta-label">Accepted at </span>
          <span className="boss-order-summary__meta-date">{ this.props.fruit_order_accepted_at } </span>
          by
          <span className="boss-order-summary__meta-user"> { this.props.fruit_order_accepted_user }</span>
        </p>
      </li>
    );
  }

  renderDoneView() {
    if (!this.props.fruit_order_done) return;

    return (
      <li className="boss-order-summary__status-item boss-order-summary__status-item_role_done">
        <p className="boss-order-summary__meta">
          <span className="boss-order-summary__meta-label">Done at </span>
          <span className="boss-order-summary__meta-date">{ this.props.fruit_order_done_at } </span>
          by
          <span className="boss-order-summary__meta-user"> { this.props.fruit_order_done_user }</span>
        </p>
      </li>
    );
  }

  renderOrders() {
    return this.props.fruit_orders.map((fruitOrder, index) => {
      return (
        <li className="boss-order-summary__list-item" key={index}>
          <p className="boss-order-summary__list-name">{ fruitOrder.name }</p>
          <p className="boss-order-summary__list-number">{ fruitOrder.number }</p>
        </li>
      );
    });
  }

  openPopover(e) {
    e.preventDefault();

    var $orders = $('.boss-table');
    var $ordersPopover = $orders.find('.boss-popover');
    var $ordersPopoverLink = $orders.find('.boss-button_role_details');
    var popoverId = e.target.getAttribute('data-popover');
    var $popover = $('div[data-popover=' + popoverId + ']');
    var $popoverLink = $('a[data-popover=' + popoverId + ']');

    if ($popover.hasClass('boss-popover_state_opened')) {
      $('body').removeClass('boss-body_state_inactive');
      $ordersPopover.fadeOut().removeClass('boss-popover_state_opened');
      $ordersPopoverLink.removeClass('boss-button_state_active');
    } else {
      $('body').addClass('boss-body_state_inactive');
      $ordersPopoverLink.removeClass('boss-button_state_active');
      $ordersPopover.fadeOut().removeClass('boss-popover_state_opened');
      $popover.fadeIn().addClass('boss-popover_state_opened');
      $popoverLink.addClass('boss-button_state_active');
    }
  }

  closePopover(e) {
    e.preventDefault();

    $('.boss-button_role_details').removeClass('boss-button_state_active');
    $('.boss-popover').fadeOut().removeClass('boss-popover_state_opened');
    $('body').removeClass('boss-body_state_inactive');
  }

  renderDeleteButton() {
    if (!this.props.user_can_delete) return;

    return (
      <span>
        <a
          className="boss-button boss-button_role_exclamation boss-page-dashboard__button"
          rel="nofollow"
          data-method="delete"
          href="/fruit_orders/1000"
        >
          Delete Current Order
        </a>
        <a
          href="#"
          className="boss-button boss-button_type_small boss-button_type_icon boss-button_role_cancel boss-table__action boss-table__action_mobile"
          rel="nofollow"
          data-method="delete"
          href="/fruit_orders/1000"
        >
        </a>
      </span>
    );
  }

  render() {
    return (
      <div className="boss-table__info">
        <p className="boss-table__label">Action</p>

        <div className="boss-table__actions">
          <a href="#" className="boss-button boss-button_type_small boss-button_role_details boss-table__action" data-popover={ this.props.popover_id } onClick={ this.openPopover.bind(this) }>Details</a>
          { this.renderDeleteButton() }
        </div>

        <div className="boss-popover boss-popover_context_order-details" data-popover={ this.props.popover_id }>
          <a href="#" className="boss-popover__close" onClick={ this.closePopover.bind(this) }>Close</a>

          <div className="boss-popover__inner">
            <div className="boss-order-summary">
              <div className="boss-order-summary__group">
                <h4 className="boss-order-summary__title">
                  <span className="boss-order-summary__title-text boss-order-summary__title-text_role_key">Venue</span>
                  <span className="boss-order-summary__title-label boss-order-summary__title-label_role_value">{ this.props.venue_name }</span>
                </h4>

                <p className="boss-order-summary__meta boss-order-summary__meta_role_date boss-order-summary__meta_adjust_nested">
                  <span className="boss-order-summary__meta-label">Created at </span>
                  <span className="boss-order-summary__meta-date">{ this.props.created_at }</span>
                </p>
              </div>

              <div className="boss-order-summary__group">
                <h4 className="boss-order-summary__title">
                  <span className="boss-order-summary__title-text">Status</span>
                </h4>

                <ul className="boss-order-summary__status boss-order-summary__status_adjust_nested">
                  { this.renderAcceptedView() }
                  { this.renderDoneView() }
                </ul>
              </div>

              <div className="boss-order-summary__group">
                <h4 className="boss-order-summary__title">
                  <span className="boss-order-summary__title-text">Order</span>
                </h4>

                <ul className="boss-order-summary__list">
                  { this.renderOrders() }
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
