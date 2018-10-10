class InvitesController < ApplicationController
  before_action :authorize, except: [:accept]
  skip_before_filter :authenticate_user!, only: [:accept]
  before_filter :set_new_layout
  skip_before_action :verify_authenticity_token, only: [:accept]

  def index
    unless status_from_params.present?
      return redirect_to(invites_path(index_redirect_params))
    end

    access_token = current_user.current_access_token || WebApiAccessToken.new(user: current_user).persist!
    invites = Invite.all.includes(inviter: [:name])

    render locals: {
      access_token: access_token.token,
      invites: invites,
      venues: Venue.all
    }
  end

  def accept
    invite = Invite.find_by!(token: params[:id])

    if invite.accepted?
      flash[:alert] = 'The invite has already been used please sign in to continue'
      redirect_to new_user_session_path
    elsif invite.revoked?
      flash[:alert] = 'The invite could not be used because it has been revoked'
      redirect_to new_user_session_path
    else
      render(layout: "empty", locals: {})
    end
  end

  private
  def role_from_params
    params[:role]
  end

  def status_from_params
    params[:status]
  end

  def index_redirect_params
    {
      status: status_from_params || "open",
      role: role_from_params || "any",
    }
  end

  def authorize
    authorize! :manage, :user_invites
  end
end
