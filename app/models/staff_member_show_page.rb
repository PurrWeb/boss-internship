class StaffMemberShowPage
  def self.tab_title_class(section, active_tab)
    active_tab.to_s == section.to_s ? "tabs-title is-active" : "tabs-title"
  end
  def self.tab_content_class(section, active_tab)
    active_tab.to_s == section.to_s ? "tabs-panel is-active" : "tabs-panel"
  end
end
