var StaffMembersController = Paloma.controller('StaffMembers');

StaffMembersController.prototype.show = function() {
  $('.staff-member-nav-tabs a').click(function(e) {
    var url = $(this).data('push-state-url');
    window.history.pushState({}, '', url);
    $(this).tab('show');
  });

  $('.staff-member-nav-tabs li.active a').tab('show');
};
