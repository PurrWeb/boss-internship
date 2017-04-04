var VenueHealthCheckController = Paloma.controller('VenueHealthCheck');

VenueHealthCheckController.prototype.show = function() {
  var $selectTag = $('#filter-area');

  $selectTag.on('change', function() {
    $(this).closest('form').submit();
  });
};
