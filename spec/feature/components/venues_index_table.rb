module PageObject
  class VenuesIndexTable < Component
    def self.columns
      [:name, :staff_count]
    end

    page_action :click_on_detail do |column, venue:|
      listing = index_listing_for(venue)
      listing.find(detail_selector_for(column)).click_link(detail_text(listing, column))
    end

    page_action :ensure_details_displayed_for do |venue|
      listing = index_listing_for(venue)

      expect(detail_text(listing, :name)).to eq(venue.name)
      expect(detail_text(listing, :staff_count)).to eq(venue.staff_members.count.to_s)
    end

    def scope
      page.find('table[data-role="venues-index-table"]')
    end

    private
    def index_listing_for(venue)
      find(:css, ".venues-index-listing[data-venue-id=\"#{venue.id}\"]")
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
        staff_count:  { detail_selector: 'td[data-role="staff-count"]'  }
      }
    end
  end
end
