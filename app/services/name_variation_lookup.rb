class NameVariationLookup
  def first_name(name)
    FirstNameOption.find_by_sql(query(name)).map(&:name)
  end

  def surname(name)
    case name
      when /\A(mc|van|o)[\s|\']*([a-zA-Z]+)\z/i
        prefix = $1
        name = $2
        ["#{prefix}#{name}", "#{prefix} #{name}", "#{prefix}'#{name}"]
      else
        []
    end
  end

  def query(name, enabled = true)
    first_names_group = Arel::Table.new(:first_name_groups, :as => 'groups')
    first_names_table = Arel::Table.new(:first_name_options, :as => 'a')
    first_names_table2 = Arel::Table.new(:first_name_options, :as => 'b')

    query = first_names_table
      .project(first_names_table2[:name], first_names_table2[:first_name_group_id])
      .distinct
      .join(first_names_group)
      .on(first_names_group[:id].eq(first_names_table[:first_name_group_id]))
      .join(first_names_table2)
      .on(first_names_table2[:first_name_group_id].eq(first_names_table[:first_name_group_id]))
    query = query.where(first_names_table[:name].eq(name)) if name.present?
    query = query.where(first_names_group[:enabled].eq(enabled)) unless enabled.nil?
    query.to_sql
  end
end
