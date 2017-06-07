class NamesIndexQuery
  def initialize(enabled:, name:, relation: FirstNameOption.unscoped)
    @enabled = enabled
    @name = name
    @relation = relation
  end
  attr_reader :enabled, :name

  def all
    first_name_service = NameVariationLookup.new
    @all ||= begin
      enabled = ActiveRecord::Type::Boolean.new.type_cast_from_user(self.enabled)
      result = first_name_service.query(name, enabled)
      relation.find_by_sql(result)
    end
  end

  private
  attr_reader :relation
end
