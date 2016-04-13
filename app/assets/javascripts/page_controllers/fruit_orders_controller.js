var FruitOrdersController = Paloma.controller('FruitOrders');

FruitOrdersController.prototype.index = function(){
  $('#current-fruit-order-form').submit(function(){
    return false;
  });

  $('#current-fruit-order-venue-select').change(function(){
    var select = $(this);
    document.location.href = '/fruit_orders?venue_id=' + select.val();
  });
};
