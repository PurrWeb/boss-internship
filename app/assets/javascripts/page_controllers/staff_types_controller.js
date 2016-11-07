var StaffTypesController = Paloma.controller('StaffTypes');

StaffTypesController.prototype.index = function(){
  $('.staff-type-color-field').change(function(el){
    field = $(this);
    type = field.data("type");

    badge = $('.staff-badge[data-type="' + type + '"]');
    badge.attr('style', 'background-color: ' + field.val());
  });
}
