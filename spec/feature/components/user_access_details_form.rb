module PageObject
  class UserAccessDetailsForm < Component
    include Chosen::Rspec::FeatureHelpers

    page_action :update_venues do |venues|
      chosen_select(
        *venues.map{ |v| v.name.titleize },
        from: 'user-venues-select'
      )
      submit_form
    end

    page_action :update_role do |role|
      scope.select(role.titleize, from: 'Role')
      submit_form
    end

    page_action :ui_shows_role do |role|
      role_select = find(:select, '.role-select')
      expect(role_select.value).to eq(role.titleize)
    end

    def scope
      find('.user-form')
    end

    private
    def submit_form
      scope.click_button('Update')
    end
  end
end
