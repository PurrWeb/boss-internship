class StaffMembersController < ApplicationController
  before_action :set_new_layout, only: [:index, :new, :show, :holidays, :profile]

  def index
    authorize! :manage, :staff_members

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

      render locals: {
        staff_member: Api::V1::StaffMemberProfile::StaffMemberSerializer.new(staff_member),
        access_token: access_token,
        staff_types: StaffType.all,
        venues: Venue.all,
        pay_rates: PayRate.selectable_by(current_user),
        gender_values: StaffMember::GENDERS
      }
    else
      flash.now[:alert] = "You're not authorized to view all of this staff member's details. Contact an admin for further assistance."

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
      
      if holiday_start_date_from_params.present? && holiday_end_date_from_params.present?
        holiday_start_date = holiday_start_date_from_params
        holiday_end_date = holiday_end_date_from_params
      else
        holiday_start_date = tax_year.start_date
        holiday_end_date = tax_year.end_date
      end

      filtered_holidays = InRangeQuery.new(
        relation: staff_member.active_holidays,
        start_value: holiday_start_date,
        end_value: holiday_end_date,
        start_column_name: 'start_date',
        end_column_name: 'end_date'
      ).all

      holidays_in_tax_year = HolidayInTaxYearQuery.new(
       relation: staff_member.active_holidays,
       tax_year: tax_year
      ).all.includes(:frozen_by)

      paid_holiday_days = holidays_in_tax_year.paid.to_a.sum { |holiday| holiday.days }
      unpaid_holiday_days = holidays_in_tax_year.unpaid.to_a.sum { |holiday| holiday.days }
      estimated_accrued_holiday_days = AccruedHolidayEstimate.new(
        staff_member: staff_member,
        tax_year: tax_year
      ).call

      access_token = current_user.current_access_token || WebApiAccessToken.new(user: current_user).persist!

      render locals: {
        staff_member: StaffMemberSerializer.new(staff_member),
        access_token: access_token,
        holidays: ActiveModel::Serializer::CollectionSerializer.new(filtered_holidays, serializer: ::HolidaySerializer),
        paid_holiday_days: paid_holiday_days,
        unpaid_holiday_days: unpaid_holiday_days,
        estimated_accrued_holiday_days: estimated_accrued_holiday_days,
        holiday_start_date: holiday_start_date,
        holiday_end_date: holiday_end_date,
      }
    else
      flash.now[:alert] = "You're not authorized to view all of this staff member's details. Contact an admin for further assistance."

      render 'reduced_show', locals: {
        staff_member: staff_member
      }
    end
  end

  def new
    authorize! :manage, :staff_members
    access_token = current_user.current_access_token || WebApiAccessToken.new(user: current_user).persist!
    venues = Venue.all
    pay_rates = PayRate.selectable_by(current_user)
    staff_types = StaffType.all
    gender_values = StaffMember::GENDERS

    render locals: {
      access_token: access_token,
      venues: venues,
      pay_rates: pay_rates,
      staff_types: staff_types,
      gender_values: gender_values
    }
  end
  
  private
  def holiday_start_date_from_params
    UIRotaDate.parse!(params['start_date'])
  end

  def holiday_end_date_from_params
    UIRotaDate.parse!(params['end_date'])
  end
end
