module PageObject
  class StaffMembersIndexTable < Component
    def self.columns
      [:name, :venues, :staff_type]
    end

    page_action :click_on_detail do |column, staff_member:|
      listing = index_listing_for(staff_member)
      listing.find(detail_selector_for(column)).click_link(detail_text(listing, column))
    end

    page_action :ensure_details_displayed_for do |staff_member|
      listing = index_listing_for(staff_member)

      expect(detail_text(listing, :name)).to eq(staff_member.full_name.titlecase)

      venues = (Array(staff_member.master_venue) + staff_member.work_venues.to_a).compact
      venues_text = venues.length > 0 ? venues.map(&:name).to_sentence : 'N / A'
      expect(detail_text(listing, :venues)).to eq(venues_text)

      expect(detail_text(listing, :staff_type)).to eq(staff_member.staff_type.name.titlecase)
    end

    page_action :ensure_record_not_displayed_for do |staff_member|
      expect(scope).to_not have_selector(:css, staff_member_entry_selector(staff_member))
    end

    def scope
      page.find('table[data-role="staff-members-index-table"]')
    end

    private
    def index_listing_for(staff_member)
      scope.find(:css, staff_member_entry_selector(staff_member))
    end

    def staff_member_entry_selector(staff_member)
      ".staff-members-index-listing[data-staff-member-id=\"#{staff_member.id}\"]"
    end

    def detail_text(listing, column)
      section = listing.find(detail_selector_for(column))
      section.text
    end

    def detail_selector_for(column)
      column_data.fetch(column){
        raise 'unsupported detail'
      }.fetch(:detail_selector)
    end

    def column_data
      {
        name:  { detail_selector: 'td[data-role="name"]'  },
        venues:  { detail_selector: 'td[data-role="venues"]'  },
        staff_type:  { detail_selector: 'td[data-role="staff-type"]'  }
      }
    end
  end
end
