module PageObject
  class StaffMembersIndexFilter < Component
    page_action :toggle_show do
      scope.find(".boss-dropdown__switch_role_filter").click
    end

    page_action :filter_by_staff_type do |staff_type|
      scope.select(staff_type.name.titlecase, from: 'Staff type')
      submit_form
    end

    page_action :ui_shows_filtering_by_staff_type do |staff_type|
      select = scope.find('input[name="staff_type"]', visible: false)
      expect(select.value).to eq(staff_type.try(:id).to_s)
    end

    page_action :filter_by_venue do |venue|
      scope.select(venue.name.titlecase, from: "Venue")
      submit_form
    end

    page_action :ui_shows_filtering_by_venue do |venue|
      select = scope.find('input[name="venue"]', visible: false)
      expect(select.value).to eq(venue.try(:id).to_s)
    end

    page_action :ensure_records_returned do |count|
      expect(records_returned_section.text).to eq(count.to_s)
    end

    def ensure_not_visible
      expect(page).to_not have_selector(filter_selector)
    end

    private
    def filter_selector
      '.boss-page-dashboard__filter'
    end

    def scope
      page.find(filter_selector)
    end

    def submit_form
      scope.click_button('Update')
    end

    def records_returned_section
      scope.find('span.records-returned-count')
    end
  end
end
