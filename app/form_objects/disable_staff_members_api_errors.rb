class DisableStaffMembersApiErrors
  def initialize(disable_staff_member_form:)
    @disable_staff_member_form = disable_staff_member_form
  end
  attr_reader :disable_staff_member_form

  def errors
    error_messages = disable_staff_member_form.errors.messages
    result = {}
    error_messages.each do |key, errors|
      result[key] = errors if errors.present?
    end
    result
  end
end
