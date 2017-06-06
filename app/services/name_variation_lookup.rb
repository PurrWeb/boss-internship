class NameVariationLookup
  def call(name)
    first_names_table = Arel::Table.new(:first_name_options, :as => 'a')
    first_names_table2 = Arel::Table.new(:first_name_options, :as => 'b')
    query = first_names_table
      .project(first_names_table2[:name])
      .join(first_names_table2)
      .on(first_names_table2[:first_name_group_id].eq(first_names_table[:first_name_group_id]))
      .where(first_names_table[:name].eq(name))
    FirstNameOption.find_by_sql(query.to_sql).map(&:name)
  end
end
