module NavigationHelper
  def in_user_section?
    controller_name == 'users'
  end

  def in_staff_members_section?
    controller_name == 'staff_members'
  end
end
