module PageObject
  class StaffMemberEmploymentDetailsForm < Component
    include Chosen::Rspec::FeatureHelpers

    page_action :select_national_insurance_number do |national_insurance_number|
      _select_national_insurance_number(national_insurance_number)
    end

    page_action :update_national_insurance_number do |national_insurance_number|
      _select_national_insurance_number(national_insurance_number)
      _submit_form
    end

    page_action :ui_shows_national_insurance_number do |national_insurance_number|
      expect(
        scope.find_field('National insurance number').value
      ).to eq(national_insurance_number)
    end

    page_action :select_master_venue do |venue|
      _select_master_venue(venue)
    end

    page_action :update_master_venue do |venue|
      _select_master_venue(venue)
      _submit_form
    end

    page_action :select_work_venues do |venues|
      _select_work_venues(venues)
    end

    page_action :update_work_venues do |venues|
      _select_work_venues(venues)
      _submit_form
    end

    page_action :ui_shows_master_venue do |venue|
      expect(
        scope.find(master_venue_select_selector).value
      ).to eq(venue.id.to_s)
    end

    page_action :ui_shows_work_venues do |venues|
      expect(
        scope.find(work_venues_select_selector).value
      ).to eq(venues.map(&:id).map(&:to_s))
    end

    page_action :select_staff_type do |staff_type|
      _select_staff_type(staff_type)
    end

    page_action :update_staff_type do |staff_type|
      _select_staff_type(staff_type)
      _submit_form
    end

    page_action :ui_shows_staff_type do |staff_type|
      expect(
        scope.find_field('Staff type').value
      ).to eq(staff_type.id.to_s)
    end

    page_action :update_start_date do |date|
      _fill_in_start_date(date)
      _submit_form
    end

    page_action :fill_in_start_date do |date|
      _fill_in_start_date(date)
    end

    page_action :submit do
      _submit_form
    end

    def scope
      find('.employment-details-form')
    end

    private
    def starts_at_field
      @starts_at_field ||= DatePickerField.new(
        self,
        selector: '.staff-member-starts-at-field'
      )
    end

    def _fill_in_start_date(date)
      starts_at_field.fill_in_date(date)
    end

    def work_venues_select_id
      'staff-member-work-venues-select'
    end

    def work_venues_select_selector
      "##{work_venues_select_id}"
    end

    def master_venue_select_id
      'staff-member-master-venue-select'
    end

    def master_venue_select_selector
      "##{master_venue_select_id}"
    end

    def _select_master_venue(venue)
      chosen_select(
        venue.name.titleize,
        from: master_venue_select_id
      )
    end

    def _select_work_venues(venues)
      select = find(work_venues_select_selector)
      currently_selected = select.value.map{ |value| Venue.find(value).name.titleize }

      if currently_selected.present?
        chosen_unselect(
          *currently_selected,
          from: work_venues_select_id
        )
      end

      chosen_select(
        *venues.map{ |v| v.name.titleize },
        from: work_venues_select_id
      )
    end

    def _select_national_insurance_number(national_insurance_number)
      scope.fill_in('National insurance number', with: national_insurance_number)
    end

    def _select_staff_type(staff_type)
      scope.select(staff_type.name.titlecase, from: 'Staff type')
    end

    def _submit_form
      scope.click_button('Update Staff member')
    end
  end
end
