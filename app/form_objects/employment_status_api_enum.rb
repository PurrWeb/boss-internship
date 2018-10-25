class EmploymentStatusApiEnum
  UI_OPTION_A = 'employment_status_a'
  UI_OPTION_B = 'employment_status_b'
  UI_OPTION_C = 'employment_status_c'
  UI_OPTION_D = 'employment_status_d'
  UI_OPTION_P45 = 'employment_status_p45_supplied'
  OPTIONS = [UI_OPTION_A, UI_OPTION_B, UI_OPTION_C, UI_OPTION_D, UI_OPTION_P45]

  def initialize(value:)
    assert_value_valid!(value)
    @value = value
  end
  attr_reader :value

  def to_params
    {
      employment_status_a: value == UI_OPTION_A,
      employment_status_b: value == UI_OPTION_B,
      employment_status_c: value == UI_OPTION_C,
      employment_status_d: value == UI_OPTION_D,
      employment_status_p45_supplied: value == UI_OPTION_P45
    }
  end

  private
  def assert_value_valid!(value)
    raise "supplied value \"#{value}\" invalid" unless (
      OPTIONS.include?(value) || value == nil
    )
  end
end
