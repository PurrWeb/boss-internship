class ResetPasswordController < ApplicationController
  before_action :set_new_layout
  skip_before_filter :authenticate_user!

  def show
    if !staff_member_from_verification_token.present? || !staff_member_from_verification_token.enabled?
      return redirect_to expired_reset_password_index_path
    end
    if !staff_member_from_verification_token.enabled?
      return redirect_to something_went_wrong_reset_password_index_path
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
