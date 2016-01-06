module PageObject
  class StaffMembersIndexFilter < Component
    page_action :filter_by_staff_type do |staff_type|
      scope.select(staff_type.name.titlecase, from: 'Staff type')
      submit_form
    end

    page_action :ui_shows_filtering_by_staff_type do |staff_type|
      select = scope.find(:select, 'Staff type')
      expect(select.value).to eq(staff_type.try(:id).to_s)
    end

    page_action :filter_by_venue do |venue|
      scope.select(venue.name.titlecase, from: "Venue")
      submit_form
    end

    page_action :ui_shows_filtering_by_venue do |venue|
      select = scope.find(:select, 'Venue')
      expect(select.value).to eq(venue.try(:id).to_s)
    end

    page_action :ensure_records_returned do |count|
      expect(records_returned_section.text).to eq(count.to_s)
    end

    private
    def scope
      page.find('.staff-members-index-filter')
    end

    def submit_form
      scope.click_button('Update')
    end

    def records_returned_section
      scope.find('span.records-returned-count')
    end
  end
end
