class UsersIndexPage < PageObject
  def surf_to
    visit(url_helpers.users_path)
  end

  page_action :click_manage_invites_button do
    click_link 'Manage Invites'
  end

  def navigation
    @navigation ||= NavigationBar.new(self)
  end

  def user_table
    @user_table ||= UsersIndexTable.new(self)
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
