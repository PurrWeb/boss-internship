class UsersIndexPage < PageObject
  def surf_to
    visit(url_helpers.users_path)
  end

  page_action :click_add_user_button do
    click_link 'Add User'
  end

  page_action :ensure_flash_success_message_displayed do |message|
    expect(find('.alert.alert-success')).to have_text(message)
  end

  page_action :click_on_detail do |detail, user:|
    listing = index_listing_for(user)
    listing.find(detail_selector_for(detail)).click_link(detail_text(listing, detail))
  end

  page_action :ensure_details_displayed_for do |user|
    listing = index_listing_for(user)

    expect(detail_text(listing, :name)).to eq(user.full_name)

    expect(detail_text(listing, :email)).to eq(user.email)

    expect(detail_text(listing, :role)).to eq(user.role.titleize)
  end

  def navigation
    @navigation ||= NavigationBar.new(self)
  end

  def assert_on_correct_page
    expect(page_heading).to(
      have_text(expected_page_heading_text),
      "expected page heading to have test '#{expected_page_heading_text}' got '#{page_heading.text}'"
    )
  end

  private
  def index_listing_for(user)
    find(:css, ".users-index-listing[data-user-id=\"#{user.id}\"]")
  end

  def detail_text(listing, detail)
    section = listing.find(detail_selector_for(detail))
    section.text
  end

  def detail_selector_for(detail)
    user_detail_data.fetch(detail){
      raise 'unsupported detail'
    }.fetch(:selector)
  end

  def user_detail_data
    {
      name:  { selector: 'td[data-role="name"]'  },
      email: { selector: 'td[data-role="email"]' },
      role:  { selector: 'td[data-role="role"]'  }
    }
  end

  def page_heading
    page.find('main h1')
  end

  def expected_page_heading_text
    'Users'
  end
end
