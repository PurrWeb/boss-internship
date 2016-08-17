module PageObject
  class FlaggedStaffMemberList < Component
    page_action :ensure_details_displayed_for do |staff_member|
      index_listing_for(staff_member)
    end

    page_action :ensure_record_not_displayed_for do |staff_member|
      expect(scope).to_not have_selector(:css, staff_member_entry_selector(staff_member))
    end

    def scope
      page.find('.flagged-staff-member-list')
    end

    private
    def index_listing_for(staff_member)
      scope.find(:css, staff_member_entry_selector(staff_member))
    end

    def staff_member_entry_selector(staff_member)
      ".staff-member-listing[data-staff-member-id=\"#{staff_member.id}\"]"
    end
  end
end
