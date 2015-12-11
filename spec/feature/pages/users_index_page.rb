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

  page_action :ensure_details_displayed_for do |user|
    record = find(:css, ".users-index-listing[data-user-id=\"#{user.id}\"]")

    name_section = record.find('td[data-role="name"]')
    expect(name_section.text).to eq(user.full_name)

    email_section = record.find('td[data-role="email"]')
    expect(email_section.text).to eq(user.email)

    role_section = record.find('td[data-role="role"]')
    expect(role_section.text).to eq(user.role.titleize)
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
