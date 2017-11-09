module PageObject
  class InvitesIndexFilter < Component
    page_action :ui_shows_filtering_by_status do |status|
      select = scope.find(:select, 'Status')
      selected_option = select.find("option[value=\"#{select.value}\"]")
      expect(selected_option.text).to eq(status.to_s.titlecase)
    end

    page_action :filter_by_status do |status|
      scope.select(status.to_s.titlecase, from: "Status")
      submit_form
    end

    page_action :ui_shows_filtering_by_role do |role|
      select = scope.find(:select, 'Role')
      expect(select.value.titlecase).to eq(role.try(:titlecase).to_s)
    end

    page_action :filter_by_role do |role|
      scope.select(role.titlecase, from: "Role")
      submit_form
    end

    page_action :ensure_records_returned do |count|
      expect(records_returned_section.text).to eq("Displaying all #{count.to_s} invites")
    end

    private
    def scope
      page.find('.boss-page-dashboard__filter')
    end

    def submit_form
      scope.click_button('Update')
    end

    def records_returned_section
      page.find('.boss-page-main__count')
    end
  end
end
