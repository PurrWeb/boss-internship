module PageObject
  class StaffMembersIndexTable < Component
    def self.columns
      [:name, :master_venue, :work_venues, :staff_type]
    end

    page_action :click_on_detail do |column, staff_member:|
      listing = index_listing_for(staff_member)
      listing.find(detail_selector_for(column)).click_link(detail_text(listing, column))
    end

    page_action :ensure_details_displayed_for do |staff_member|
      listing = index_listing_for(staff_member)

      expect(detail_text(listing, :name)).to eq(staff_member.full_name.titlecase)

      master_venue_text = staff_member.master_venue.present? ? staff_member.master_venue.name : 'N / A'
      expect(detail_text(listing, :master_venue)).to eq(master_venue_text)

      work_venues = staff_member.work_venues.to_a
      work_venues_text = work_venues.length > 0 ? work_venues.map(&:name).to_sentence : 'N / A'
      expect(detail_text(listing, :work_venues)).to eq(work_venues_text)

      expect(detail_text(listing, :staff_type)).to eq(staff_member.staff_type.name.titlecase)
    end

    page_action :ensure_record_not_displayed_for do |staff_member|
      expect(scope).to_not have_selector(:css, staff_member_entry_selector(staff_member))
    end

    def scope
      page.find('div.boss-table_page_staff-members-index')
    end

    private
    def index_listing_for(staff_member)
      scope.find(:css, staff_member_entry_selector(staff_member))
    end

    def staff_member_entry_selector(staff_member)
      ".test-staff-members-index-listing[data-staff-member-id=\"#{staff_member.id}\"]"
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
        name:  { detail_selector: '.boss-table__info[data-role="name"] > .boss-table__text'  },
        master_venue:  { detail_selector: '.boss-table__info[data-role="master-venue"] > .boss-table__text'  },
        work_venues: { detail_selector: '.boss-table__info[data-role="work-venues"] > .boss-table__text'},
        staff_type:  { detail_selector: '.boss-table__info[data-role="staff-type"] > .boss-table__text'  }
      }
    end
  end
end
