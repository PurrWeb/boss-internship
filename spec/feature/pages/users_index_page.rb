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

  page_action :ensure_record_displayed_for do |user|
    find(:css, ".users-index-listing[data-user-id=\"#{user.id}\"]")
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
  def page_heading
    page.find('main h1')
  end

  def expected_page_heading_text
    'Users'
  end
end
