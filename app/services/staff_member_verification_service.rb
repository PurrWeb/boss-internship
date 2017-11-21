class StaffMemberVerificationService
  class Result < Struct.new(:staff_member, :success, :api_errors)
    def success?
      success
    end
  end

  attr_accessor :staff_member
  
  def initialize(staff_member:)
    @staff_member = staff_member
  end

  def send_verification
    success = false
    api_errors = {}

    if staff_member.verified?
      staff_member.errors.add(:base, :blank, message: "Staff member already verified")
    elsif staff_member.verification_sent_at.present?
      staff_member.errors.add(:base, :blank, message: "Verification already sent")
    else
      generate_confirmation_token
      staff_member.save
      StaffMemberVerificationMailer.send_verification_email(staff_member: staff_member, token: staff_member.verification_token).deliver_now
      success = true
    end
    if staff_member.errors.empty?
      success = true
    else
      api_errors = StaffMemberVerificationApiErrors.new(staff_member: staff_member)
    end
    Result.new(staff_member, success, api_errors)
  end

  def set_password_and_verify(password:, password_confirmation:)
    success = false
    api_errors = nil

    if staff_member.verified?
      staff_member.errors.add(:base, "Staff member already verified")
    else
      staff_member.password = password
      staff_member.password_confirmation = password_confirmation
      staff_member.password_set_at = Time.now.utc
      staff_member.verified_at = Time.now.utc
      staff_member.save

    end

    if staff_member.errors.empty?
      success = true
    else
      api_errors = StaffMemberVerificationApiErrors.new(staff_member: staff_member)
    end

    Result.new(staff_member, success, api_errors)
  end

  def generate_confirmation_token
    if staff_member.verification_token
      staff_member.verification_token
    else
      staff_member.verification_token = Devise.friendly_token
      staff_member.verification_sent_at = Time.now.utc
    end
  end
end
