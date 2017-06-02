class FlaggedStaffMemberQuery
  def initialize(first_name:, surname:, date_of_birth:, email_address:, national_insurance_number:)
    @first_name = first_name
    @surname = surname
    @date_of_birth = date_of_birth
    @email_address = email_address
    @national_insurance_number = national_insurance_number
  end
  attr_reader :first_name, :surname, :date_of_birth, :email_address, :national_insurance_number

  def all
    names_table = Arel::Table.new(:names)
    staff_members_table = Arel::Table.new(:staff_members)
    email_addresses_table = Arel::Table.new(:email_addresses)

    where_clauses = []
    where_clauses << (
      names_table.grouping(
        names_table.grouping(
          names_table[:first_name].matches("%#{first_name}%")
        ).
        and(
          names_table.grouping(
            names_table[:surname].eq(surname)
          )
        )
      )
    )
    where_clauses << staff_members_table[:date_of_birth].eq(date_of_birth) if date_of_birth.present?
    where_clauses << email_addresses_table[:email].eq(email_address) if email_address.present?
    where_clauses << staff_members_table[:national_insurance_number].eq(national_insurance_number.upcase) if national_insurance_number.present?

    StaffMember.
      flagged.
      joins(:name).
      joins(:email_address).
      where(
        where_clauses.inject(nil) do |result_clause, clause|
          result_clause.present? ? result_clause.or(clause) : clause
        end
      ).
      uniq
  end
end
