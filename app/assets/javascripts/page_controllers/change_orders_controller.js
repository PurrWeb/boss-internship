var ChangeOrdersController = Paloma.controller('ChangeOrders');

ChangeOrdersController.prototype.index = function(){
  $('#current-change-order-form').submit(function(){
    return false;
  });

  $('#current-change-order-venue-select').change(function(){
    var select = $(this);
    document.location.href = '/change_orders?venue_id=' + select.val();
  });
}
