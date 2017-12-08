class Api::V1::DailyReportSerializer < ActiveModel::Serializer
  include ActionView::Helpers::NumberHelper
  attributes :isUpdatePending, :overheadsCents, :actualCostCents, :rotaedCostCents, :varianceCents, :lastCalculatedAt, :staffTypeSections

  def isUpdatePending
    object.update_required?
  end

  def overheadsCents
    object.overheads_cents
  end

  def actualCostCents
    object.actual_cost_cents
  end

  def rotaedCostCents
    object.rotaed_cost_cents
  end

  def varianceCents
    object.variance_cents
  end

  def lastCalculatedAt
    object.last_calculated_at.utc.iso8601
  end

  def staffTypeSections
    object.staff_member_sections.map do |staff_member_section|
      {
        staffTypeName: staff_member_section.staff_type.name,
        staffTypeColor: staff_member_section.staff_type.ui_color,
        roteadCostCents: staff_member_section.rotaed_cost_cents,
        actualCostCents: staff_member_section.actual_cost_cents,
        staffMemberListings: staff_member_section.staff_member_listings.map do |staff_member_listing|
          {
            fullName: staff_member_listing.staff_member.full_name.titlecase,
            payrateDescription: listing_payrate_description(staff_member_listing),
            rotaedHours: number_with_precision(
              staff_member_listing.rotaed_hours,
              precision: 2,
              strip_insignificant_zeros: true
            ),
            rotaedCostCents: staff_member_listing.rotaed_cost_cents,
            workedHours: number_with_precision(
              staff_member_listing.worked_hours,
              precision: 2,
              strip_insignificant_zeros: true
            ),
            breakHours: number_with_precision(
              staff_member_listing.break_hours,
              precision: 2,
              strip_insignificant_zeros: true
            ),
            hourlyCostCents: hourly_cost_cents_value(staff_member_listing)
          }
        end
      }
    end
  end

  private
  def listing_payrate_description(staff_member_listing)
    if  staff_member_listing.pay_rate_admin?
       staff_member_listing.pay_rate_name.titlecase
    else
       staff_member_listing.pay_rate_text_description_short
    end
  end

  def hourly_cost_cents_value(staff_member_listing)
    staff_member_listing.actual_cost_cents if staff_member_listing.pay_rate_hourly?
  end
end