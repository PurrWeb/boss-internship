class StaffMemberShowPage
  def self.tab_class(section, active_tab)
    "active" if active_tab.to_s == section.to_s
  end
end
