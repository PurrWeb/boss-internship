class StaffMemberIndexFilterQuery
  def initialize(status:, staff_type:, venue:, accessible_venues:, relation: StaffMember.unscoped)
    @staff_type = staff_type
    @relation = relation
    @venue = venue
    @accessible_venues = accessible_venues
    @status = status
  end

  def all
    @all ||= begin
      result = filter_by_status(relation)
      if staff_type.present?
        result = result.where(staff_type: staff_type)
      end

      if venue.present?
        result = result.joins(:venue).merge(venue_relation)
      else
        result = result.joins('LEFT JOIN `staff_member_venues` ON `staff_member_venues`.`staff_member_id` = `staff_members`.`id`').where('(`staff_member_venues`.`staff_member_id` IS NULL) OR (`staff_member_venues`.`venue_id` IN (?))', accessible_venues.pluck(:id))
      end

      result
    end
  end

  private
  attr_reader :staff_type, :relation, :venue, :accessible_venues, :status

  def venue_relation
    Venue.where('(`venues`.`id` = ?) AND (`venues`.`id` IN (?))', venue.id, accessible_venues.pluck(:id))
  end

  def filter_by_status(relation_to_filter)
    case status
    when 'enabled'
      relation_to_filter.enabled
    when 'disabled'
      relation_to_filter.disabled
    else
      relation_to_filter
    end
  end
end
