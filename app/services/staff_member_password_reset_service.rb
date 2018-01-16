class StaffMemberPasswordResetService
  class Result < Struct.new(:staff_member, :success, :api_errors)
    def success?
      success
    end
  end

  attr_accessor :staff_member

  def initialize(staff_member:)
    @staff_member = staff_member
  end

  def send_password_reset_email
    success = false
    api_errors = {}

    if !staff_member.verified?
      staff_member.errors.add(:base, :blank, message: "Staff member not verified")
    else
      generate_token
      staff_member.save
      StaffMemberPasswordResetMailer.send_password_reset_email(staff_member: staff_member, token: staff_member.verification_token).deliver_now
      success = true
    end

    if staff_member.errors.empty?
      success = true
    else
      api_errors = StaffMemberResetPasswordApiErrors.new(staff_member: staff_member)
    end

    Result.new(staff_member, success, api_errors)
  end

  def reset_password(password:, password_confirmation:)
    success = false
    api_errors = nil

    if !staff_member.verified?
      staff_member.errors.add(:base, "Staff member not verified")
    elsif !password.present? || !password_confirmation.present?
      staff_member.errors.add(:password, "Password field can't be empty") if !password.present?
      staff_member.errors.add(:password_confirmation, "Password confirmation field can't be empty")  if !password_confirmation.present?
    else
      staff_member.password = password
      staff_member.password_confirmation = password_confirmation
      staff_member.password_set_at = Time.now.utc
      staff_member.verification_token = nil
      staff_member.verification_sent_at = nil
      staff_member.save
    end

    if staff_member.errors.empty?
      success = true
    else
      api_errors = StaffMemberResetPasswordApiErrors.new(staff_member: staff_member)
    end

    Result.new(staff_member, success, api_errors)
  end

  def generate_token
    staff_member.verification_token = Devise.friendly_token
    staff_member.verification_sent_at = Time.now.utc
  end
end
