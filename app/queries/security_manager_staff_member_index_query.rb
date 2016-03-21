class SecurityManagerStaffMemberIndexQuery
  def initialize(relation: StaffMember.all, status:, name_text:, email_text:)
    @relation = relation
    @name_text = name_text
    @email_text = email_text
    @status = status
  end

  def all
    result = relation.
      joins(:staff_type).
      merge(StaffType.security)

    if name_text.present?
      result = result.
        joins(:name).
        where(
          "(`names`.first_name LIKE ?) OR (`names`.surname LIKE ?)",
          "%#{name_text}%",
          "%#{name_text}%"
        )
    end

    if email_text.present?
      result = result.
        joins(:email_address).
        where("LOWER(`email_addresses`.email) = LOWER(?)", email_text)
    end

    filter_by_status(result)
  end

  private
  attr_reader :relation, :status, :name_text, :email_text

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
