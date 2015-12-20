class UsersIndexTable < PageObject::Component
  def self.columns
    [:name, :email, :role]
  end

  page_action :click_on_detail do |column, user:|
    listing = index_listing_for(user)
    listing.find(detail_selector_for(column)).click_link(detail_text(listing, column))
  end

  page_action :ensure_details_displayed_for do |user|
    listing = index_listing_for(user)

    expect(detail_text(listing, :name)).to eq(user.full_name)

    expect(detail_text(listing, :email)).to eq(user.email)

    expect(detail_text(listing, :role)).to eq(user.role.titleize)
  end

  def scope
    page.find('table[data-role="users-index-table"]')
  end

  private
  def index_listing_for(user)
    find(:css, ".users-index-listing[data-user-id=\"#{user.id}\"]")
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
      email: { detail_selector: 'td[data-role="email"]' },
      role:  { detail_selector: 'td[data-role="role"]'  }
    }
  end

end
