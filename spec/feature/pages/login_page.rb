class LoginPage < PageObject
  def surf_to
    visit(url_helpers.new_user_session_path)
  end

  page_action :sign_in do |email:, password:|
    fill_in('Email', with: email)
    fill_in('Password', with: password)
    click_button('Sign in')
  end

  def assert_on_correct_page
    expect(page_heading).to(
      have_text(expected_page_heading_text),
      "Expected page header to contain '#{expected_page_heading_text}' got '#{page_heading.text}'"
    )
  end

  private
  def page_heading
    page.find('main h3')
  end

  def expected_page_heading_text
    'Sign in'
  end
end
