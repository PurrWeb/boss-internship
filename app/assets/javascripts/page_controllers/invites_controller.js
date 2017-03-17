var InvitesController = Paloma.controller('Invites');

function newFormAction() {
  function onRoleChange(){
    var roleSelect = $('.invite-role-select');
    var value = roleSelect[0].value;
    var venueSelectSection = $('.venue-select-section');

    if (value === 'manager'){
      venueSelectSection.removeClass('boss3-hidden');
    } else {
      venueSelectSection.addClass('boss3-hidden');
    }
  };

  $('.invite-role-select').change(onRoleChange);

  onRoleChange();
};

InvitesController.prototype.new = newFormAction;
InvitesController.prototype.create = newFormAction;

