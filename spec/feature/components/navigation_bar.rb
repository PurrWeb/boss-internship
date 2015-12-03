class NavigationBar < PageComponent
  page_action :ensure_sections_appear do |*sections|
    sections.each do |section|
      expect(scope).to have_selector(section_selector(section))
    end
  end

  page_action :ensure_sections_only_appear do |*sections|
    sections.each do |section|
      expect(scope).to have_selector(section_selector(section))
    end

    ensure_sections_dont_appear(*(possible_sections - sections))
  end

  page_action :ensure_sections_dont_appear do |*sections|
    sections.each do |section|
      expect(scope).to_not have_selector(section_selector(section))
    end
  end

  page_action :ensure_login_details_displayed_in_user_section do |user|
    expect(user_section).to have_text("Signed in as #{user.email}")
  end

  page_action :ensure_logout_link_displayed_in_user_section do
    link = user_section.find_link('Sign out')
    expect(link['href']).to eq(url_helpers.destroy_user_session_path)
  end

  def possible_sections
    section_data.keys
  end

  def scope
    find('header div.navbar')
  end

  private
  def user_section
    scope.find(section_selector(:user))
  end

  def section_data
    {
      brand: {
        selector: '.nav-brand-section'
      },
      user: {
        selector: '.nav-user-section'
      }
    }
  end

  def section_selector(section)
    section_data.fetch(section, "'#{section}' section unsupported").fetch(:selector)
  end
end
