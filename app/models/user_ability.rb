class UserAbility
  include CanCan::Ability

  def initialize(user)
    # Define abilities for the passed in user here. For example:
    #
    if user && user.enabled?
      if user.has_effective_access_level?(AccessLevel.admin_access_level)
        can :manage, :admin
      end

      can :view, :ops_diary do
        user.has_effective_access_level?(AccessLevel.ops_manager_access_level)
      end

      can [:create, :update, :enable, :disable], :ops_diary do
        user.has_effective_access_level?(AccessLevel.ops_manager_access_level)
      end

      can :view, :sse_tests do
        user.has_effective_access_level?(AccessLevel.dev_access_level)
      end

      can :view, :names_page do
        user.has_effective_access_level?(AccessLevel.admin_access_level)
      end

      can :manage, :user_invites do
        user.has_effective_access_level?(AccessLevel.admin_access_level)
      end

      can :view, :users_page do
        user.has_effective_access_level?(AccessLevel.admin_access_level)
      end

      can [:edit, :create_staff_member], User do |target_user|
        user.has_effective_access_level?(AccessLevel.admin_access_level)
      end

      can [:enable, :disable], User do |target_user|
        target_user != user &&
        user.has_effective_access_level?(AccessLevel.admin_access_level)
      end

      can :view, :staff_types_page do
        user.has_effective_access_level?(AccessLevel.admin_access_level)
      end

      can :edit, :staff_types do
        user.has_effective_access_level?(AccessLevel.admin_access_level)
      end

      can :view, :pay_rates_page do
        user.payroll_manager? ||
        user.has_effective_access_level?(AccessLevel.admin_access_level)
      end

      can [:create, :destroy, :create_admin, :edit], :pay_rate do
        user.payroll_manager? ||
        user.has_effective_access_level?(AccessLevel.admin_access_level)
      end

      can :view, :staff_tracking_page do
        user.payroll_manager? ||
        user.has_effective_access_level?(AccessLevel.admin_access_level)
      end

      can [:view, :complete], :finance_reports do
        user.payroll_manager? ||
        user.has_effective_access_level?(AccessLevel.admin_access_level)
      end

      can :view, :yearly_reports do
        user.payroll_manager? ||
        user.has_effective_access_level?(AccessLevel.admin_access_level)
      end

      can :view, :accessories_page do
        user.has_effective_access_level?(AccessLevel.admin_access_level)
      end

      can [:create, :edit, :destroy, :enable], :accessory do
        user.has_effective_access_level?(AccessLevel.admin_access_level)
      end

      can :view, :api_keys_page do
        user.area_manager? ||
        user.has_effective_access_level?(AccessLevel.admin_access_level)
      end

      can [:destroy, :create], :api_keys do
        user.has_effective_access_level?(AccessLevel.admin_access_level)
      end

      can :view, :venues_page do
        user.has_effective_access_level?(AccessLevel.admin_access_level)
      end

      can [:edit, :create], :venues do
        user.has_effective_access_level?(AccessLevel.admin_access_level)
      end

      can :view, :machines_page do
        user.has_effective_access_level?(AccessLevel.admin_access_level)
      end

      can [:create, :update, :destroy, :restore], :machines do
        user.has_effective_access_level?(AccessLevel.admin_access_level)
      end

      can :view, :vouchers_page do
        user.has_effective_access_level?(AccessLevel.admin_access_level)
      end

      can :view, :voucher_usages_page do
        user.has_effective_access_level?(AccessLevel.admin_access_level)
      end

      can :create, :vouchers do
        user.has_effective_access_level?(AccessLevel.admin_access_level)
      end

      can :destroy, Voucher do |voucher|
        user.has_effective_access_level?(AccessLevel.admin_access_level)
      end

      can :view, :holidays_csv do
        user.has_effective_access_level?(AccessLevel.admin_access_level)
      end

      can [:view, :create, :update], :security_venues do
        user.has_effective_access_level?(AccessLevel.admin_access_level)
      end

      can :view, :security_rota do
        user.security_manager? || user.has_effective_access_level?(AccessLevel.admin_access_level)
      end

      can :view, :payment_uploads_page do
        user.payroll_manager? || (
          user.has_effective_access_level?(AccessLevel.admin_access_level)
        )
      end

      can :upload, :payment_csv do
        user.payroll_manager? || (
          user.has_effective_access_level?(AccessLevel.admin_access_level)
        )
      end

      can [:create, :destroy], :security_venue_shifts do
        user.security_manager? || user.has_effective_access_level?(AccessLevel.admin_access_level)
      end

      can :view, :accessory_requests_page do
        user.food_ops_manager? ||
        user.has_effective_access_level?(AccessLevel.ops_manager_access_level)
      end

      can [:accept, :complete, :reject, :undo], :accessories_requests do
        user.food_ops_manager? ||
        user.has_effective_access_level?(AccessLevel.ops_manager_access_level)
      end

      can [:create, :cancel, :refund_request], AccessoryRequest do |accessory_request|
        if accessory_request.staff_member.disabled?
          user.payroll_manager? ||
            user.has_effective_access_level?(AccessLevel.admin_access_level)
        else
          user.food_ops_manager? ||
          user.has_effective_access_level?(AccessLevel.ops_manager_access_level)
        end
      end

      can [:accept, :complete, :reject, :undo], AccessoryRefundRequest do |accessory_refund_request|
        if accessory_refund_request.staff_member.disabled?
          user.payroll_manager? ||
            user.has_effective_access_level?(AccessLevel.admin_access_level)
        else
          user.food_ops_manager? ||
            user.has_effective_access_level?(AccessLevel.ops_manager_access_level)
        end
      end

      can :view, :dashboard_messages_page do
        can_access_dashboard_messages_page?(user)
      end

      can [:edit, :create, :disable, :enable], DashboardMessage do
        can_access_dashboard_messages_page?(user)
      end

      can :view, :staff_vetting_page do
        can_view_main_vettings_page?(user)
      end

      can :view, :staff_without_email_vetting_page do
        can_view_main_vettings_page?(user)
      end

      can :view, :staff_without_ni_number_vetting_page do
        can_view_main_vettings_page?(user)
      end

      can :view, :staff_without_address_vetting_page do
        can_view_main_vettings_page?(user)
      end

      can :view, :staff_without_photo_vetting_page do
        can_view_main_vettings_page?(user)
      end

      can :view, :check_list_submissions_page do
        user.has_effective_access_level?(AccessLevel.manager_access_level)
      end

      can :view, :staff_on_wrong_payrate_vetting_page do
        can_view_main_vettings_page?(user)
      end

      can :view, :staff_with_expired_sia_badge_vetting_page do
        can_view_main_vettings_page?(user)
      end

      can :view, :staff_with_bounced_emails_vetting_page do
        can_view_main_vettings_page?(user)
      end

      can [:view, :accept, :complete, :edit], :change_order_reports do
        user.has_effective_access_level?(AccessLevel.area_manager_access_level)
      end

      can [:view, :accept, :complete], :fruit_order_reports do
        user.has_effective_access_level?(AccessLevel.area_manager_access_level)
      end

      can :create, QuestionnaireResponse do |questionnaire_response|
        user.has_effective_access_level?(AccessLevel.ops_manager_access_level)
      end

      can :view, :machine_refloats_page do
        user.has_effective_access_level?(AccessLevel.manager_access_level)
      end

      can :create, :machines_refloats do
        user.has_effective_access_level?(AccessLevel.manager_access_level)
      end

      can :create, MachinesRefloat do |machines_refloat|
        can_manage_venue?(user, machines_refloat.venue)
      end

      can :view, :rotas_page do
        user.food_ops_manager? ||
        user.payroll_manager? ||
        user.has_effective_access_level?(AccessLevel.manager_access_level)
      end

      can :publish, Rota do |example_rota|
        user.food_ops_manager? ||
        user.payroll_manager? ||
        user.has_effective_access_level?(AccessLevel.manager_access_level) &&
          can_manage_venue?(user, example_rota.venue)
      end

      can :manage, Rota do |rota|
        can_manage_rota?(user, rota)
      end

      can :view, :change_orders_page do
        user.has_effective_access_level?(AccessLevel.manager_access_level)
      end

      can :update, ChangeOrder do |change_order|
        user.has_effective_access_level?(AccessLevel.manager_access_level) &&
          can_manage_venue?(user, change_order.venue)
      end

      can :update, ChangeOrder do |change_order|
        user.has_effective_access_level?(AccessLevel.manager_access_level) &&
          can_update_change_order?(user, change_order)
      end

      can :destroy, ChangeOrder do |change_order|
        user.has_effective_access_level?(AccessLevel.manager_access_level) && (
          change_order.persisted? &&
            !(change_order.done? || change_order.deleted?) &&
            can_update_change_order?(user, change_order)
        )
      end

      can :view, :fruit_orders_page do
        user.has_effective_access_level?(AccessLevel.manager_access_level)
      end

      can :update, FruitOrder do |fruit_order|
        user.has_effective_access_level?(AccessLevel.manager_access_level) && (
          can_update_fruit_order?(user, fruit_order)
        )
      end

      can :destroy, FruitOrder do |fruit_order|
        user.has_effective_access_level?(AccessLevel.manager_access_level) && (
          fruit_order.persisted? &&
            !(fruit_order.done? || fruit_order.destroyed?) &&
            can_update_fruit_order?(user, fruit_order)
        )
      end

      can :view, :check_lists_page do
        user.has_effective_access_level?(AccessLevel.manager_access_level)
      end

      can [:create, :update, :destroy, :submit], :check_lists do
        user.has_effective_access_level?(AccessLevel.manager_access_level)
      end

      can [:view], :safe_checks do
        user.payroll_manager? ||
        user.has_effective_access_level?(AccessLevel.manager_access_level)
      end

      can :view, SafeChecksPage do |safe_checks_page|
        user.payroll_manager? ||
        can_manage_venue?(user, safe_checks_page.venue)
      end

      can [:create, :view, :update], SafeCheck do |safe_check|
        user.payroll_manager? ||
        can_manage_venue?(user, safe_check.venue)
      end

      can :view, :incident_report_page do
        user.has_effective_access_level?(AccessLevel.manager_access_level)
      end

      can :create, :incident_reports do
        user.has_effective_access_level?(AccessLevel.manager_access_level)
      end

      can [:view, :update, :destroy, :create], IncidentReport do |incident_report|
        user.has_effective_access_level?(AccessLevel.manager_access_level) &&
          can_manage_venue?(user, incident_report.venue)
      end

      can :view, :redeem_vouchers_page do
        user.has_effective_access_level?(AccessLevel.manager_access_level)
      end

      can :view, :holiday_requests_page do
        can_view_holidays_requests_page?(user)
      end

      can :redeem, Voucher do |voucher|
        user.has_effective_access_level?(AccessLevel.manager_access_level) &&
          can_manage_venue?(user, voucher.venue)
      end

      can :view, :venue_dashboard do
        user.has_effective_access_level?(AccessLevel.manager_access_level)
      end

      can :view, :hours_confirmation_page do
        user.payroll_manager? ||
          user.has_effective_access_level?(AccessLevel.manager_access_level)
      end

      can :view, HoursConfirmationPage do |hours_confirmation_page|
        user.payroll_manager? ||
          can_manage_venue?(user, hours_confirmation_page.venue)
      end

      can :update, HoursAcceptancePeriod do |hours_acceptance_period|
        user.payroll_manager? ||
          can_manage_venue?(user, hours_acceptance_period.venue)
      end

      can :view, :holiday_reports_page do
        user.payroll_manager? ||
          user.has_effective_access_level?(AccessLevel.manager_access_level)
      end

      can :view, :holidays do
        user.food_ops_manager? ||
        user.payroll_manager? ||
          user.has_effective_access_level?(AccessLevel.manager_access_level)
      end

      can [:view], Holiday do |holiday|
        can_view_holiday?(user, holiday)
      end

      can [:create], Holiday do |holiday|
        staff_member = holiday.staff_member
        staff_member.on_hourly_pay_rate? && can_view_holiday?(user, holiday)
      end

      can [:update, :destroy], Holiday do |holiday|
        if holiday.created_from_request?
          holiday.holiday_request.creator != user && can_view_holidays_requests_page?(user)
        else
          can_view_holiday?(user, holiday)
        end
      end

      can [:create, :destroy], HolidayRequest do |holiday_request|
        user.food_ops_manager? ||
        user.payroll_manager? ||
          can_edit_staff_member?(user, holiday_request.staff_member)
      end

      can [:accept, :reject, :update], HolidayRequest do |holiday_request|
        holiday_request.creator != user && can_view_holidays_requests_page?(user)
      end

      can :list, :staff_members do
        user.food_ops_manager? ||
        user.payroll_manager? ||
        user.security_manager? ||
          user.has_effective_access_level?(AccessLevel.manager_access_level)
      end

      can :create, :staff_members do
        user.food_ops_manager? ||
        user.payroll_manager? ||
        user.security_manager? ||
          user.has_effective_access_level?(AccessLevel.manager_access_level)
      end

      can :see_net_wages, StaffMember do |staff_member|
        user.payroll_manager? ||
        user.has_effective_access_level?(AccessLevel.admin_access_level) ||
        (user.has_effective_access_level?(AccessLevel.manager_access_level) && staff_member.on_hourly_pay_rate? )
      end

      can :enable, StaffMember do |staff_member|
        if !staff_member.disabled?
          false
        elsif staff_member.flagged?
          user.has_effective_access_level?(AccessLevel.admin_access_level)
        else
          can_edit_staff_member?(user, staff_member)
        end
      end

      can :disable, StaffMember do |staff_member|
        staff_member.enabled? &&
          user.staff_member != staff_member &&
          can_edit_staff_member?(user, staff_member)
      end

      can :edit, StaffMember do |staff_member|
        can_edit_staff_member?(user, staff_member)
      end

      can :perform_clocking_action, StaffMember do |staff_member|
        user.payroll_manager? ||
        user.has_effective_access_level?(AccessLevel.manager_access_level) && (
          can_edit_staff_member?(user, staff_member)
        )
      end

      can :view, :payroll_reports do
        user.payroll_manager? ||
          user.has_effective_access_level?(AccessLevel.manager_access_level)
      end

      can :view, :daily_reports do
        user.has_effective_access_level?(AccessLevel.manager_access_level)
      end

      can :view, :weekly_reports do
        user.has_effective_access_level?(AccessLevel.manager_access_level)
      end

      can [:create, :update, :destroy], OwedHour do |owed_hour|
        can_edit_staff_member?(user, owed_hour.staff_member)
      end

      can [:view, :create, :update, :destroy], RotaShift do |rota_shift|
        if rota_shift.security?
          user.security_manager? || user.has_effective_access_level?(AccessLevel.admin_access_level)
        else
          can_manage_rota?(user, rota_shift.rota)
        end
      end

      can [:view, :create, :update, :destroy], SecurityVenueShift do |rota_shift|
        user.security_manager? || user.has_effective_access_level?(AccessLevel.admin_access_level)
      end

      can :view, :security_shift_requests do
        can_view_shift_requests_page?(user)
      end

      can :view, :security_shift_request_reviews do
        can_view_shift_request_reviews_page?(user)
      end

      can [:update_payslip_date, :update_refund_payslip_date], :accessory_requests do
        user.payroll_manager? || user.has_effective_access_level?(AccessLevel.admin_access_level)
      end

      can [:create], SecurityShiftRequest do |security_shift_request|
        can_view_shift_requests_page?(user)
      end

      can [:delete], SecurityShiftRequest do |security_shift_request|
        can_delete_shift_request?(user, security_shift_request)
      end

      can [:accept], SecurityShiftRequest do |security_shift_request|
        can_accept_shift_request?(user, security_shift_request) &&
          can_view_shift_request_reviews_page?(user)
      end

      can [:undo], SecurityShiftRequest do |security_shift_request|
        can_undo_shift_request?(user, security_shift_request) &&
          can_view_shift_request_reviews_page?(user)
      end

      can [:edit], SecurityShiftRequest do |security_shift_request|
        can_edit_shift_requests?(user, security_shift_request)
      end

      can [:assign], SecurityShiftRequest do |security_shift_request|
        can_assign_shift_request?(user, security_shift_request) &&
          (user.security_manager? || user.has_effective_access_level?(AccessLevel.admin_access_level))
      end

      can [:reject], SecurityShiftRequest do |security_shift_request|
        next unless can_reject_shift_request?(user, security_shift_request)
        if security_shift_request.accepted?
          user.security_manager? || user.has_effective_access_level?(AccessLevel.admin_access_level)
        else
          user.has_effective_access_level?(AccessLevel.ops_manager_access_level)
        end
      end

      can :view, :venue_health_checks_page do
        user.has_effective_access_level?(AccessLevel.manager_access_level)
      end

      can :use, SendMobileAppDownloadEmailEndpoint do |send_mobile_app_download_email_endpoint|
        mobile_app = send_mobile_app_download_email_endpoint.mobile_app
        staff_member = send_mobile_app_download_email_endpoint.staff_member

        can_edit_staff_member?(user, staff_member) &&
          StaffMemberAbility.new(staff_member).can?(:access, mobile_app)
      end

      can :view, VenueHealthChecksPage do |venue_health_checks_page|
        user.has_effective_access_level?(AccessLevel.manager_access_level) &&
        can_manage_venue?(user, venue_health_checks_page.venue)
      end

      can :view, Venue do |venue|
        can_manage_venue?(user, venue)
      end

      can :view, QuestionnaireResponse do |questionnaire_response|
        can_manage_venue?(user, questionnaire_response.venue)
      end

      can :view, :maintenance_tasks do
        user.maintenance_staff? || user.has_effective_access_level?(AccessLevel.manager_access_level)
      end

      can [:view, :add_note, :change_status], MaintenanceTask do |maintenance_task|
        user.maintenance_staff? || (
          can_manage_venue?(user, maintenance_task.venue)
        )
      end

      can :manage, MaintenanceTask do |maintenance_task|
        can_manage_venue?(user, maintenance_task.venue)
      end

      can :view, :marketing_tasks_page do
        user.marketing_staff? || (
          user.has_effective_access_level?(AccessLevel.manager_access_level)
        )
      end

      can :create, :marketing_tasks do
        user.has_effective_access_level?(AccessLevel.manager_access_level)
      end

      can :assign, :marketing_tasks do
        user.marketing_staff? || (
          user.has_effective_access_level?(AccessLevel.manager_access_level)
        )
      end

      can [:view, :assign, :update_status, :create_note, :create], MarketingTask do |marketing_task|
        user.marketing_staff? || (
          user.has_effective_access_level?(AccessLevel.manager_access_level) &&
            (marketing_task.assigned_to_user != user)  &&
            can_manage_venue?(user, marketing_task.venue)
        )
      end

      can [:update, :destroy, :restore], MarketingTask do |marketing_task|
          user.has_effective_access_level?(AccessLevel.manager_access_level) &&
            can_manage_venue?(user, marketing_task.venue)
      end

      can :visit, :stock_application do
        user.food_ops_manager? ||
        user.payroll_manager? ||
          user.has_effective_access_level?(AccessLevel.manager_access_level)
      end

      can :visit, :bookings_application do
        user.payroll_manager? ||
          user.has_effective_access_level?(AccessLevel.manager_access_level)
      end

      can :visit, :cashing_up_application do
        user.payroll_manager? ||
          user.has_effective_access_level?(AccessLevel.manager_access_level)
      end

      can :view_payments, StaffMember do |staff_member|
        can_edit_staff_member?(user, staff_member)
      end
    end

    #
    # The first argument to `can` is the action you are giving the user
    # permission to do.
    # If you pass :manage it will apply to every action. Other common actions
    # here are :read, :create, :update and :destroy.
    #
    # The second argument is the resource the user can perform the action on.
    # If you pass :all it will apply to every resource. Otherwise pass a Ruby
    # class of the resource.
    #
    # The third argument is an optional hash of conditions to further filter the
    # objects.
    # For example, here the user can only update published articles.
    #
    #   can :update, Article, :published => true
    #
    # See the wiki for details:
    # https://github.com/ryanb/cancan/wiki/Defining-Abilities
  end

  def can_access_dashboard_messages_page?(user)
    user.has_effective_access_level?(AccessLevel.ops_manager_access_level)
  end

  def can_view_holidays_requests_page?(user)
    user.payroll_manager? ||
      user.food_ops_manager? ||
      user.has_effective_access_level?(AccessLevel.ops_manager_access_level)
  end

  def can_view_holiday?(user, holiday)
    user.food_ops_manager? ||
    user.payroll_manager? ||
      can_edit_staff_member?(user, holiday.staff_member)
  end

  def can_view_shift_requests_page?(user)
    user.has_effective_access_level?(AccessLevel.manager_access_level)
  end

  def can_edit_shift_requests?(user, shift_request)
    return unless shift_request.pending?
    (can_view_shift_requests_page?(user) && shift_request.creator == user) ||
          can_view_shift_request_reviews_page?(user)
  end

  def can_view_shift_request_reviews_page?(user)
    user.has_effective_access_level?(AccessLevel.ops_manager_access_level)
  end

  def can_delete_shift_request?(user, shift_request)
    shift_request.can_transition_to?(:deleted) && shift_request.creator == user
  end

  def can_reject_shift_request?(user, shift_request)
    shift_request.can_transition_to?(:rejected)
  end

  def can_assign_shift_request?(user, shift_request)
    shift_request.can_transition_to?(:assigned)
  end

  def can_accept_shift_request?(user, shift_request)
    shift_request.can_transition_to?(:accepted)
  end

  def can_undo_shift_request?(user, shift_request)
    shift_request.can_transition_to?(:pending)
  end

  def can_update_change_order?(user, change_order)
    if change_order.in_progress?
      can_manage_venue?(user, change_order.venue)
    else
      user.has_effective_access_level?(AccessLevel.admin_access_level)
    end
  end

  def can_update_fruit_order?(user, fruit_order)
    if fruit_order.in_progress?
      can_manage_venue?(user, fruit_order.venue)
    else
      user.has_effective_access_level?(AccessLevel.admin_access_level)
    end
  end

  def can_edit_staff_member?(user, staff_member)
    user.food_ops_manager? ||
    user.payroll_manager? ||
    (
      user.security_manager? &&
      staff_member.security?
    ) || (
      workable_venues = staff_member.workable_venues

      user.has_effective_access_level?(AccessLevel.manager_access_level) && (
        staff_member.security? ||
        workable_venues.length == 0 ||
        workable_venues.any? do |venue|
          can_manage_venue?(user, venue)
        end
      )
    )
  end

  def can_manage_rota?(user, rota)
    user.food_ops_manager? ||
    user.payroll_manager? ||
      can_manage_venue?(user, rota.venue)
  end

  def can_manage_venue?(user, venue)
    raise 'Attempt to compare nil venue' unless venue.present?
    user.has_effective_access_level?(AccessLevel.ops_manager_access_level) ||
    (
      user.has_effective_access_level?(AccessLevel.manager_access_level) &&
        user.venues.include?(venue)
    )
  end

  def can_view_main_vettings_page?(user)
    user.payroll_manager? ||
      user.has_effective_access_level?(AccessLevel.ops_manager_access_level)
  end
end
