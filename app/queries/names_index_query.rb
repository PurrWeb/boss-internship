class NamesIndexQuery
  def initialize(enabled:, relation: FirstNameOption.unscoped)
    @enabled = enabled
    @relation = relation
  end
  attr_reader :enabled

  def all
    @all ||= begin
      result = relation
      result = result.select([:first_name_group_id, :name])
      result = result.where(first_name_groups: {enabled: enabled === '1' ? true : false}) if enabled.present?
      result
    end
  end

  private
  attr_reader :relation
end
