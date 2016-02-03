class EmploymentStatusStatement
  def initialize(staff_member)
    @staff_member = staff_member
  end

  def point_list
    [:a, :b, :c, :d].map do |point|
      if staff_member.public_send("employment_status_#{point.to_s}")
        point.to_s.titlecase
      else
        nil
      end
    end.compact
  end

  def self.text_for_point(point)
    raise "Unsupported point #{point}" unless [:a, :b, :c, :d].include?(point)
    public_send("statement_#{point.to_s}_text")
  end

  private
  attr_reader :staff_member

  def self.statement_a_text
    "This is my first job since the 6th of April. I have not been receiving taxable Jobseeker's Allowance, Incapacity Benefit or a state/occupational pernsion."
  end

  def self.statement_b_text
    "This is now my only job. Since the 6th of April I have had another job, received taxable Jobseeker's Allowance or Incapacity Benefit. I do not receive a state/occupational pension."
  end

  def self.statement_c_text
    "I have another job or receive a state/occupational pernsion."
  end

  def self.statement_d_text
    "I left a course of higher education before the 6th of April & received my first student loan instalment on or after the 1st of September 1998 & I have not fully repaid my student loan."
  end
end
