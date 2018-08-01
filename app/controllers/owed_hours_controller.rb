class OwedHoursController < ApplicationController
  def create
    query = StaffMember.where(id: params[:staff_member_id])
    query = QueryOptimiser.apply_optimisations(query, :staff_member_show)
    staff_member = query.first

    raise ActiveRecord::RecordNotFound.new unless staff_member.present?
    authorize! :edit, staff_member

    owed_hour = OwedHour.new
    owed_hour_form = CreateOwedHourForm.new(
      OwedHourViewModel.new(owed_hour), owed_hour_params(:create)
    )
    owed_hour.creator = current_user
    owed_hour.staff_member = staff_member

    if owed_hour_form.valid?
      # Reform save! doesn't work
      if !owed_hour_form.save
        raise ActiveRecord::RecordInvalid.new(
          owed_hour_form.model.model
        )
      end

      flash[:success] = "Hours added successfully"
      redirect_to profile_staff_member_path(staff_member, tab: 'owed-hours')
    else
      flash.now[:error] = "There was a problem creating these hours"

      tax_year = TaxYear.new(RotaShiftDate.to_rota_date(Time.current))

      holidays_in_tax_year = HolidayInTaxYearQuery.new(
       relation: staff_member.active_holidays,
       tax_year: tax_year,
       staff_member_start_date: staff_member.starts_at
      ).all.includes(:finance_report)

      holiday_start_date = tax_year.start_date
      holiday_end_date = tax_year.end_date

      filtered_holidays = InRangeQuery.new(
        relation: staff_member.active_holidays,
        start_value: holiday_start_date,
        end_value: holiday_end_date,
        start_column_name: 'start_date',
        end_column_name: 'end_date'
      ).all

      paid_holiday_days = holidays_in_tax_year.paid.to_a.sum { |holiday| holiday.days }
      unpaid_holiday_days = holidays_in_tax_year.unpaid.to_a.sum { |holiday| holiday.days }
      estimated_accrued_holiday_days = AccruedHolidayEstimate.new(
        staff_member: staff_member,
        tax_year: tax_year
      ).call

      holiday = Holiday.new
      render 'staff_members/show', locals: {
        staff_member: staff_member,
        active_tab: 'owed-hours',
        owed_hour_form: owed_hour_form,
        new_holiday: holiday,
        holidays: filtered_holidays,
        paid_holiday_days: paid_holiday_days,
        unpaid_holiday_days: unpaid_holiday_days,
        estimated_accrued_holiday_days: estimated_accrued_holiday_days,
        holiday_start_date: holiday_start_date,
        holiday_end_date: holiday_end_date
      }
    end
  end

  def edit
    owed_hour = OwedHour.enabled.find(params[:id])
    authorize! :update, owed_hour

    update_owed_hour_form = UpdateOwedHourForm.new(
      OwedHourViewModel.new(owed_hour)
    )

    render locals: { update_owed_hour_form: update_owed_hour_form }
  end

  def update
    owed_hour = OwedHour.enabled.find(params[:id])
    authorize! :update, owed_hour

    new_owed_hour = OwedHour.new(
      owed_hour.attributes.
        merge(id: nil, creator: current_user)
    )

    update_owed_hour_form = UpdateOwedHourForm.new(
      OwedHourViewModel.new(new_owed_hour),
      owed_hour_params(:update)
    )

    if update_owed_hour_form.valid?
      update_owed_hour_form.sync

      ImmutableOwedHourUpdate.new(
        requester: current_user,
        old_owed_hour: owed_hour,
        new_owed_hour: new_owed_hour
      ).call

      flash[:success] = "Owed hours updated successfully"
      redirect_to profile_staff_member_path(owed_hour.staff_member, tab: 'owed-hours')
    else
      flash.now[:error] = "There was a problem updating these owed hours"

      owed_hours_form = UpdateOwedHourForm.new(
        OwedHourViewModel.new(owed_hour),
        owed_hour_params(:update)
      )
      owed_hours_form.valid?

      render 'edit', locals: {
        update_owed_hour_form: owed_hours_form
      }
    end
  end

  def destroy
    owed_hour = OwedHour.enabled.find(params[:id])
    authorize! :destroy, owed_hour

    result = DeleteOwedHour.new(
      requester: current_user,
      owed_hour: owed_hour
    ).call

    if result.success?
      flash[:success] = 'Owed hour deleted successfully'
      redirect_to profile_staff_member_path(owed_hour.staff_member, tab: 'owed-hours')
    else
      flash[:error] = "There was a problem deleting these hours"
      render 'edit', locals: { owed_hour: result.owed_hour }
    end
  end

  private
  def owed_hour_params(action)
    # Had to work around rails not typecasting starts_at_offset and ends_at_offset
    # to integer
    starts_at_offset_from_params = params["#{action}_owed_hour"]['starts_at_offset']
    ends_at_offset_from_params = params["#{action}_owed_hour"]['ends_at_offset']

    params.
      require("#{action}_owed_hour").
      permit(
        :date,
        :starts_at_offset,
        :ends_at_offset,
        :note
      ).merge(
        date: date_from_params(action),
        starts_at_offset: starts_at_offset_from_params.present? && Integer(starts_at_offset_from_params),
        ends_at_offset: ends_at_offset_from_params.present? && Integer(ends_at_offset_from_params)
      )
  end

  def date_from_params(action)
    if params["#{action}_owed_hour"]['date'].present?
      UIRotaDate.parse(params["#{action}_owed_hour"]['date'])
    end
  end
end
