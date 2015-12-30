class StaffMembersIndexTable < PageObject::Component
  def self.columns
    [:name, :venue]
  end

  page_action :click_on_detail do |column, staff_member:|
    listing = index_listing_for(staff_member)
    listing.find(detail_selector_for(column)).click_link(detail_text(listing, column))
  end

  page_action :ensure_details_displayed_for do |staff_member|
    listing = index_listing_for(staff_member)

    expect(detail_text(listing, :name)).to eq(staff_member.full_name)

    expect(detail_text(listing, :venue)).to eq(staff_member.venue.name)
  end

  def scope
    page.find('table[data-role="staff_members-index-table"]')
  end

  private
  def index_listing_for(staff_member)
    find(:css, ".staff-members-index-listing[data-staff-member-id=\"#{staff_member.id}\"]")
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
      venue:  { detail_selector: 'td[data-role="venue"]'  }
    }
  end

end
