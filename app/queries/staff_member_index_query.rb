class StaffMemberIndexQuery
  def initialize(staff_type:, relation: StaffMember.unscoped)
    @staff_type = staff_type
    @relation = relation
  end

  def all
    @all ||= begin
      result = relation

      if staff_type.present?
        result = result.where(staff_type: staff_type)
      end

      result
    end
  end

  private
  attr_reader :staff_type, :relation
end
