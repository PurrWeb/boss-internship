module NavigationHelper
  def in_admin_section?
    controller_name == 'users' ||
      controller_name == 'invites' ||
      controller_name == 'venues'
  end

  def in_staff_members_section?
    controller_name == 'staff_members' || controller_name == 'staff_types'
  end

  def in_rotas_section?
    controller_name == 'rotas'
  end
end
