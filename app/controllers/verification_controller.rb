class VerificationController < ActionController::Base

  def show
    staff_member = StaffMember.find_by(verification_token: params[:id])
    token = access_token = staff_member.current_access_token || AppApiAccessToken.new(staff_member: staff_member).persist!
    redirect_to reset_password_index_path(token: token.token)
  end
end
