module PageObject
  class NavigationBar < Component
    page_action :ensure_branding_displayed do
      link = scope.find("[data-link-role='navbar-brand']")
      expect(link).to have_text('BOSS')
      expect(link['href']).to eq('/')
    end

    page_action :ensure_top_level_sections_displayed do |*sections|
      Array(sections).each do |section|
        expect(scope).to have_selector(section_selector(section))
      end
    end

    page_action :ensure_user_section_not_displayed do
      expect(scope).not_to have_selector(user_section_selector)
    end

    page_action :ensure_user_section_displayed_for do |user|
      ensure_user_section_login_details_displayed_for(user)
      ensure_user_section_logout_link_displayed
    end

    page_action :ensure_admin_sections_displayed do |*sections|
      if Array(sections).present?
          admin_section = scope.find(admin_section_selector)
          Array(sections).each do |section|
            expect(admin_section).to have_selector(section_selector(section, type: :admin))
          end
      else
        expect(scope).to_not have_selector(admin_section_selector)
      end
    end

    def scope
      find('#main-menu')
    end

    private
    def section_displayed?(section)
      scope.has_selector?(section_selector(section))
    end

    def ensure_user_section_login_details_displayed_for(user)
      expect(user_section).to have_text("Signed in as #{user.email}")
    end

    def ensure_user_section_logout_link_displayed
      link = user_section.find_link('Sign out')
      expect(link['href']).to eq(url_helpers.destroy_user_session_path)
    end

    def user_section
      scope.find(user_section_selector)
    end

    def user_section_selector
      "[data-navbar-section='user']"
    end

    def admin_section_selector
      '.nav-admin-section'
    end

    def top_level_section_data
      {
        staff_members: {
          selector: '.nav-staff-members-section'
        },
        rota: {
          selector: '.nav-rota-section'
        },
        admin: {
          selector: '.nav-admin-section'
        }
      }
    end

    def admin_section_data
      {
        users: {
          selector: '.nav-users-section'
        },
        venues: {
          selector: '.nav-venues-section'
        },
        staff_types: {
          selector: '.nav-staff-types-section'
        },
        invites: {
          selector: '.nav-invites-section'
        }
      }
    end

    def section_selector(section, type: :normal)
      data = type == :admin ? admin_section_data : top_level_section_data
      data.fetch(section) { raise "'#{section}' section unsupported" }.fetch(:selector)
    end
  end
end
