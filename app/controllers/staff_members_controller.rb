class StaffMembersController < ApplicationController
  before_action :set_new_layout, only: [:index, :new, :show, :holidays, :profile, :owed_hours, :accessories, :payments]

  def index
    authorize! :list, :staff_members

    staff_member_index_filter = StaffMemberIndexFilter.new(
      user: current_user,
      params: params
    )

    query = if current_user.security_manager?
      staff_member_index_filter.security_manager_staff_member_index_query
    else
      staff_member_index_filter.staff_member_index_query
    end

    staff_members = query.
      all.
      includes(:name).
      includes(:staff_type).
      includes(:master_venue).
      includes(:work_venues).
      order(updated_at: :desc).
      paginate(page: params[:page], per_page: 20)

    render locals: {
      staff_members: staff_members,
      filter: staff_member_index_filter
    }
  end

  def show
    return redirect_to profile_staff_member_path
  end

  def profile
    query = StaffMember.where(id: params[:id])
    query = QueryOptimiser.apply_optimisations(query, :staff_member_show)
    staff_member = query.first

    raise ActiveRecord::RecordNotFound.new unless staff_member.present?

    if can? :edit, staff_member
      access_token = current_user.current_access_token || WebApiAccessToken.new(user: current_user).persist!
      accessible_pay_rate_ids = UserAccessiblePayRatesQuery.new(
        user: current_user,
        pay_rate: staff_member.pay_rate
      ).page_pay_rates.map(&:id)

      app_download_link_data = get_app_download_link_data(staff_member)

      render locals: {
        staff_member: Api::V1::StaffMemberProfile::StaffMemberSerializer.new(staff_member),
        app_download_link_data: app_download_link_data,
        access_token: access_token,
        staff_types: StaffType.all,
        venues: Venue.all,
        pay_rates: ActiveModel::Serializer::CollectionSerializer.new(
          PayRate.all,
          serializer: Api::V1::StaffMemberProfile::PayRateSerializer,
          scope: current_user
        ),
        gender_values: StaffMember::GENDERS,
        accessible_venue_ids: Venue.all.pluck(:id),
        accessible_pay_rate_ids: accessible_pay_rate_ids,
        staff_member_profile_permissions: StaffMemberProfilePermissions.new(
          staff_member: staff_member,
          current_user: current_user
        )
      }
    else
      render 'reduced_show', locals: {
        staff_member: staff_member
      }
    end
  end

  def holidays
    query = StaffMember.where(id: params[:id])
    query = QueryOptimiser.apply_optimisations(query, :staff_member_show)
    staff_member = query.first

    raise ActiveRecord::RecordNotFound.new unless staff_member.present?
    if can? :edit, staff_member
      tax_year = TaxYear.new(RotaShiftDate.to_rota_date(Time.current))

      if !holiday_tab_params_present?
        return redirect_to(holidays_staff_member_path(holiday_tab_params(staff_member: staff_member, tax_year: tax_year)))
      end
      holiday_start_date = holiday_start_date_from_params
      holiday_end_date = holiday_end_date_from_params

      index_query = StaffMemberProfileHolidayIndexQuery.new(
        staff_member: staff_member,
        start_date: holiday_start_date,
        end_date: holiday_end_date,
        payslip_start_date: holiday_tab_payslip_start_date_from_params,
        payslip_end_date: holiday_tab_payslip_end_date_from_params,
      )

      filtered_holidays = index_query.holidays.includes(:creator, holiday_request: [:creator])

      filtered_holiday_requests = index_query.holiday_requests.includes([:creator])

      holidays_in_tax_year = HolidayInTaxYearQuery.new(
       relation: staff_member.active_holidays,
       tax_year: tax_year,
       staff_member_start_date: staff_member.starts_at
      ).all.includes(:finance_report)

      paid_holiday_days = holidays_in_tax_year.paid.to_a.sum { |holiday| holiday.days }
      unpaid_holiday_days = holidays_in_tax_year.unpaid.to_a.sum { |holiday| holiday.days }
      estimated_accrued_holiday_days = AccruedHolidayEstimate.new(
        staff_member: staff_member,
        tax_year: tax_year
      ).call

      access_token = current_user.current_access_token || WebApiAccessToken.new(user: current_user).persist!

      accessible_pay_rate_ids = UserAccessiblePayRatesQuery.new(
        user: current_user,
        pay_rate: staff_member.pay_rate
      ).page_pay_rates.map(&:id)

      app_download_link_data = get_app_download_link_data(staff_member)

      render locals: {
        staff_member: staff_member,
        app_download_link_data: app_download_link_data,
        access_token: access_token,
        holidays: ActiveModel::Serializer::CollectionSerializer.new(
          filtered_holidays.includes(:holiday_request),
          serializer: Api::V1::StaffMemberProfile::HolidaySerializer,
          scope: current_user
        ),
        holiday_requests: ActiveModel::Serializer::CollectionSerializer.new(
          filtered_holiday_requests,
          serializer: Api::V1::StaffMemberProfile::HolidayRequestSerializer,
          scope: current_user
        ),
        paid_holiday_days: paid_holiday_days,
        unpaid_holiday_days: unpaid_holiday_days,
        estimated_accrued_holiday_days: estimated_accrued_holiday_days,
        holiday_start_date: holiday_start_date,
        holiday_end_date: holiday_end_date,
        holiday_start_payslip_date: holiday_tab_payslip_start_date_from_params,
        holiday_end_payslip_date: holiday_tab_payslip_end_date_from_params,
        staff_types: StaffType.all,
        accessible_pay_rate_ids: accessible_pay_rate_ids,
        gender_values: StaffMember::GENDERS,
        venues: Venue.all,
        accessible_venue_ids: Venue.all.pluck(:id),
        pay_rates: ActiveModel::Serializer::CollectionSerializer.new(
          PayRate.all,
          serializer: Api::V1::StaffMemberProfile::PayRateSerializer,
          scope: current_user
        ),
        accessible_pay_rates: accessible_pay_rate_ids,
        staff_member_profile_permissions: StaffMemberProfilePermissions.new(
          staff_member: staff_member,
          current_user: current_user,
          holidays: filtered_holidays,
          holiday_requests: filtered_holiday_requests
        ),
        is_admin_plus: current_user.has_effective_access_level?(AccessLevel.admin_access_level)
      }
    else
      flash.now[:alert] = "You're not authorized to view all of this staff member's details. Contact an admin for further assistance."
      render 'reduced_show', locals: {
        staff_member: staff_member
      }
    end
  end

  def owed_hours
    query = StaffMember.where(id: params[:id])
    query = QueryOptimiser.apply_optimisations(query, :staff_member_show)
    staff_member = query.first

    raise ActiveRecord::RecordNotFound.new unless staff_member.present?

    if can? :edit, staff_member
      index_query = StaffMemberProfileOwedHourIndexQuery.new(
        staff_member: staff_member,
        start_date: owed_hours_tab_start_date_from_params,
        end_date: owed_hours_tab_end_date_from_params,
        payslip_start_date: owed_hours_tab_payslip_start_date_from_params,
        payslip_end_date: owed_hours_tab_payslip_end_date_from_params
      )

      owed_hours = index_query.all.includes(creator: [:name])

      access_token = current_user.current_access_token || WebApiAccessToken.new(user: current_user).persist!
      serialized_owed_hours = OwedHourWeekView.new(owed_hours: owed_hours).serialize

      accessible_pay_rate_ids = UserAccessiblePayRatesQuery.new(
        user: current_user,
        pay_rate: staff_member.pay_rate
      ).page_pay_rates.map(&:id)

      app_download_link_data = get_app_download_link_data(staff_member)

      render locals: {
        staff_member: Api::V1::StaffMemberProfile::StaffMemberSerializer.new(staff_member),
        app_download_link_data: app_download_link_data,
        owed_hours: serialized_owed_hours,
        access_token: access_token.token,
        staff_types: StaffType.all,
        venues: Venue.all,
        gender_values: StaffMember::GENDERS,
        accessible_venue_ids: Venue.all.pluck(:id),
        pay_rates: ActiveModel::Serializer::CollectionSerializer.new(
          PayRate.all,
          serializer: Api::V1::StaffMemberProfile::PayRateSerializer,
          scope: current_user
        ),
        accessible_pay_rate_ids: accessible_pay_rate_ids,
        venues: Venue.all,
        accessible_venue_ids: Venue.all.pluck(:id),
        accessible_pay_rates: accessible_pay_rate_ids,
        filter_start_date: owed_hours_tab_start_date_from_params,
        filter_end_date: owed_hours_tab_end_date_from_params,
        filter_payslip_start_date: owed_hours_tab_payslip_start_date_from_params,
        filter_payslip_end_date: owed_hours_tab_payslip_end_date_from_params,
        staff_member_profile_permissions: StaffMemberProfilePermissions.new(
          staff_member: staff_member,
          current_user: current_user,
          owed_hours: owed_hours,
        ),
        is_admin_plus: current_user.has_effective_access_level?(AccessLevel.admin_access_level)
      }
    end
  end

  def payments
    query = StaffMember.where(id: params[:id])
    query = QueryOptimiser.apply_optimisations(query, :staff_member_show)
    staff_member = query.first

    raise ActiveRecord::RecordNotFound.new unless staff_member.present?

    if !payment_index_params_present?
      return redirect_to(payments_staff_member_path(payment_index_params(staff_member)))
    end

    payments = StaffMemberPaymentsIndexQuery.new(
      staff_member: staff_member,
      start_date: payment_filter_start_date_from_params,
      end_date: payment_filter_end_date_from_params,
      status_filter: payment_filter_status_filter_from_params
    ).
      all.
      includes([:created_by_user, staff_member: :name])

    profile_dashboard_data = GetStaffMemberProfileDashboardData.new(staff_member: staff_member, requester: current_user).call

    access_token = current_user.current_access_token || WebApiAccessToken.new(user: current_user).persist!

    ability = UserAbility.new(current_user)

    if can? :edit, staff_member
      render locals: {
        ability: ability,
        payments: payments,
        payment_filter: payment_filter_values,
        staff_member: Api::V1::StaffMemberProfile::StaffMemberSerializer.new(staff_member),
        app_download_link_data: profile_dashboard_data.app_download_link_data,
        access_token: access_token,
        staff_types: profile_dashboard_data.staff_types,
        venues: profile_dashboard_data.venues,
        pay_rates: ActiveModel::Serializer::CollectionSerializer.new(
          profile_dashboard_data.pay_rates,
          serializer: Api::V1::StaffMemberProfile::PayRateSerializer,
          scope: current_user
        ),
        gender_values: profile_dashboard_data.gender_values,
        accessible_venue_ids: profile_dashboard_data.accessible_venue_ids,
        accessible_pay_rate_ids: profile_dashboard_data.accessible_pay_rate_ids,
        staff_member_profile_permissions: StaffMemberProfilePermissions.new(
          staff_member: staff_member,
          current_user: current_user
        )
      }
    else
      render 'reduced_show', locals: {
        staff_member: staff_member
      }
    end
  end

  def accessories
    query = StaffMember.where(id: params[:id])
    query = QueryOptimiser.apply_optimisations(query, :staff_member_show)
    staff_member = query.first
    return redirect_to profile_staff_member_path if staff_member.security?

    raise ActiveRecord::RecordNotFound.new unless staff_member.present?

    access_token = current_user.current_access_token || WebApiAccessToken.new(user: current_user).persist!
    accessible_pay_rate_ids = UserAccessiblePayRatesQuery.new(
      user: current_user,
      pay_rate: staff_member.pay_rate
    ).page_pay_rates.map(&:id)

    venue_accessories = staff_member.master_venue.accessories.enabled
    accessory_requests = staff_member.accessory_requests.includes([:finance_report, :created_by_user, :accessory, accessory_refund_request: [:staff_member, :created_by_user]])

    app_download_link_data = get_app_download_link_data(staff_member)

    render locals: {
      staff_member: Api::V1::StaffMemberProfile::StaffMemberSerializer.new(staff_member),
      access_token: access_token.token,
      app_download_link_data: app_download_link_data,
      staff_types: StaffType.all,
      venues: Venue.all,
      gender_values: StaffMember::GENDERS,
      accessible_venue_ids: Venue.all.pluck(:id),
      pay_rates: ActiveModel::Serializer::CollectionSerializer.new(
        PayRate.all,
        serializer: Api::V1::StaffMemberProfile::PayRateSerializer,
        scope: current_user
      ),
      venue_accessories: ActiveModel::Serializer::CollectionSerializer.new(
        venue_accessories,
        serializer: Api::V1::StaffMemberProfile::AccessorySerializer,
      ),
      accessory_requests: ActiveModel::Serializer::CollectionSerializer.new(
        accessory_requests,
        serializer: Api::V1::StaffMemberProfile::AccessoryRequestSerializer,
      ),
      accessible_pay_rate_ids: accessible_pay_rate_ids,
      accessible_pay_rates: accessible_pay_rate_ids,
      staff_member_profile_permissions: StaffMemberProfilePermissions.new(
        staff_member: staff_member,
        current_user: current_user
      )
    }
  end

  def new
    authorize! :create, :staff_members
    access_token = current_user.current_access_token || WebApiAccessToken.new(user: current_user).persist!
    venues = Venue.all

    pay_rates = PayRate.selectable_by(current_user)

    staff_types = StaffType.all
    gender_values = StaffMember::GENDERS

    render locals: {
      access_token: access_token,
      venues: venues,
      pay_rates: ActiveModel::Serializer::CollectionSerializer.new(
        pay_rates,
        serializer: Api::V1::StaffMemberProfile::PayRateSerializer,
        scope: current_user
      ),
      staff_types: staff_types,
      gender_values: gender_values
    }
  end

  private
  def holiday_tab_params_present?
    holiday_tab_filtering_by_date? || holiday_tab_filtering_by_payslip_date?
  end

  def holiday_tab_filtering_by_date?
    holiday_start_date_from_params.present? && holiday_end_date_from_params.present?
  end

  def holiday_tab_filtering_by_payslip_date?
    holiday_tab_payslip_start_date_from_params.present? && holiday_tab_payslip_end_date_from_params.present?
  end

  def holiday_tab_params(staff_member:, tax_year:)
    {
      id: staff_member.id,
      start_date: UIRotaDate.format(holiday_start_date_from_params || tax_year.start_date),
      end_date: UIRotaDate.format(holiday_end_date_from_params || tax_year.end_date),
      payslip_start_date: holiday_tab_payslip_start_date_from_params.present? ? UIRotaDate.format(holiday_tab_payslip_start_date_from_params) : nil,
      payslip_end_date: holiday_tab_payslip_end_date_from_params.present? ? UIRotaDate.format(holiday_tab_payslip_end_date_from_params) : nil
    }
  end

  def payment_index_params_present?
    payment_filter_start_date_from_params.present? && payment_filter_end_date_from_params.present? && payment_filter_status_filter_from_params.present?
  end

  def payment_index_params(staff_member)
    {
      staff_member_id: staff_member.id,
      start_date: payment_filter_start_date_from_params || UIRotaDate.format(default_payment_filter_start_date),
      end_date: payment_filter_end_date_from_params || UIRotaDate.format(default_payment_filter_end_date),
      status_filter: payment_filter_status_filter_from_params || default_payment_filter_status_filter
    }
  end

  def payment_filter_values
    {
      start_date: payment_filter_start_date_from_params,
      end_date: payment_filter_end_date_from_params,
      status_filter: payment_filter_status_filter_from_params
    }
  end

  def owed_hour_tab_filtering_by_date?
    owed_hours_tab_start_date_from_params.present? && owed_hours_tab_end_date_from_params.present?
  end

  def owed_hour_tab_filtering_by_payslip_date?
    owed_hours_tab_payslip_start_date_from_params.present? && owed_hours_tab_payslip_end_date_from_params.present?
  end

  def owed_hours_tab_start_date_from_params
    UIRotaDate.parse_if_present(params["start_date"])
  end

  def owed_hours_tab_end_date_from_params
    UIRotaDate.parse_if_present(params["end_date"])
  end

  def owed_hours_tab_payslip_start_date_from_params
    UIRotaDate.parse_if_present(params["payslip_start_date"])
  end

  def owed_hours_tab_payslip_end_date_from_params
    UIRotaDate.parse_if_present(params["payslip_end_date"])
  end

  def payment_filter_start_date_from_params
    UIRotaDate.safe_parse(params[:start_date])
  end

  def payment_filter_end_date_from_params
    UIRotaDate.safe_parse(params[:end_date])
  end

  def payment_filter_status_filter_from_params
    params[:status_filter] if params[:status_filter].present? && StaffMemberPaymentPageFilter::STATUS_FILTER_VALUES.include?(params[:status_filter])
  end

  def default_payment_filter_start_date
    current_tax_year.start_date
  end

  def default_payment_filter_end_date
    current_tax_year.end_date
  end

  def default_payment_filter_status_filter
    StaffMemberPaymentPageFilter::SHOW_ALL_STATUS_FILTER_VALUE
  end

  def holiday_start_date_from_params
    UIRotaDate.parse_if_present(params['start_date'])
  end

  def holiday_end_date_from_params
    UIRotaDate.parse_if_present(params['end_date'])
  end

  def holiday_tab_payslip_start_date_from_params
    UIRotaDate.parse_if_present(params['payslip_start_date'])
  end

  def holiday_tab_payslip_end_date_from_params
    UIRotaDate.parse_if_present(params['payslip_end_date'])
  end

  def get_app_download_link_data(staff_member)
    GetAppDownloadLinkData.new(staff_member: staff_member).call
  end

  def current_tax_year
    @current_tax_year ||= TaxYear.new(RotaShiftDate.to_rota_date(Time.current))
  end
end
