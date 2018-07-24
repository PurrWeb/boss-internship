class DisciplinaryApiErrors
  def initialize(disciplinary:)
    @disciplinary = disciplinary
  end
  attr_reader :disciplinary

  def errors
    result = {}
    result[:base] = disciplinary.errors[:base] if disciplinary.errors[:base].present?
    result[:title] = disciplinary.errors[:title] if disciplinary.errors[:title].present?
    result[:note] = disciplinary.errors[:note] if disciplinary.errors[:note].present?
    result[:level] = disciplinary.errors[:level] if disciplinary.errors[:level].present?
    result[:createdByUser] = disciplinary.errors[:created_by_user] if disciplinary.errors[:created_by_user].present?
    result[:staffMember] = disciplinary.errors[:staff_member] if disciplinary.errors[:staff_member].present?

    result
  end
end
