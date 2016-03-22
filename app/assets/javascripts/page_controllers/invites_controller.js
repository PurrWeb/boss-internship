var InvitesController = Paloma.controller('Invites');

function newFormAction() {
  function onRoleChange(){
    var roleSelect = $('.invite-role-select');
    var value = roleSelect[0].value;
    var venueSelectSection = $('.venue-select-section');

    if (value === 'manager'){
      venueSelectSection.removeClass('hidden');
    } else {
      venueSelectSection.addClass('hidden');
    }
  };

  $('.invite-role-select').change(onRoleChange);

  onRoleChange();
};

InvitesController.prototype.new = newFormAction;
InvitesController.prototype.create = newFormAction;

