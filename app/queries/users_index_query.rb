class UsersIndexQuery
  def initialize(role:, status:, name_text:, email_text:, relation: User.unscoped)
    @relation = relation
    @name_text = name_text
    @email_text = email_text
    @role = role
    @status = status
  end

  def all
    @all ||= begin
      result = relation
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
      result = filter_by_status(result)
      result = result.where(role: role) if role.present?
      result = result.
        joins(:name).
        order('LOWER(CONCAT(`names`.first_name, `names`.surname))')
      result
    end
  end

  private
  attr_reader :role, :relation, :status, :name_text, :email_text

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
