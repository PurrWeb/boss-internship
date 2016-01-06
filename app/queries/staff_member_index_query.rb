class StaffMemberIndexQuery
  def initialize(staff_type:, venue:, relation: StaffMember.unscoped)
    @staff_type = staff_type
    @relation = relation
    @venue = venue
  end

  def all
    @all ||= begin
      result = relation

      if staff_type.present?
        result = result.where(staff_type: staff_type)
      end

      if venue.present?
        result = result.for_venue(venue)
      end

      result
    end
  end

  private
  attr_reader :staff_type, :relation, :venue
end
