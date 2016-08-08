var SafeChecksController = Paloma.controller('SafeChecks');

SafeChecksController.prototype.index = function(){
  $('#safe-checks-current-venue-select').change(function(){
    $('#safe-checks-venue-form').submit();
  });
}
