class SetPasswordController < ApplicationController
  before_action :set_new_layout

  def show
    if !staff_member_from_verification_token.present? || !staff_member_from_verification_token.enabled?
      return redirect_to something_went_wrong_set_password_index_path
    end
    if staff_member_from_verification_token.verification_expired?
      return redirect_to expired_set_password_index_path
    end

    render(
      layout: "empty",
      locals: {
        verification_token: params.fetch(:id)
      }
    )
  end

  def something_went_wrong
    render(
      layout: "empty",
    )
  end

  def expired
    render(
      layout: "empty",
    )
  end

  def success
    render(
      layout: "empty",
    )
  end

  private
  def staff_member_from_verification_token
    StaffMember.find_by(verification_token: params.fetch(:id))
  end
end
