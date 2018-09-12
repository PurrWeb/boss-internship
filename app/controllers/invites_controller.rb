class InvitesController < ApplicationController
  before_action :authorize, except: [:accept]
  skip_before_filter :authenticate_user!, only: [:accept]
  before_filter :set_new_layout
  skip_before_action :verify_authenticity_token, only: [:accept]

  def index
    access_token = current_user.current_access_token || WebApiAccessToken.new(user: current_user).persist!
    invites = Invite.all.includes(inviter: [:name])

    render locals: {
      access_token: access_token.token,
      invites: invites,
      venues: Venue.all
    }
  end

  def new
    invite = Invite.new
    render locals: { invite: invite }
  end

  def create
    invite = Invite.new(invite_params.merge(inviter_id: current_user.id))

    if invite.save
      InviteMailer.invite_mail(invite).deliver_now
      flash[:success] = "Invite created successfully"
      redirect_to action: :index
    else
      flash.now[:error] = "There was a problem creating this invite"
      render 'new', locals: { invite: invite }
    end
  end

  def accept
    invite = Invite.find_by!(token: params[:id])

    if invite.accepted?
      flash[:alert] = 'The invite has already been used please sign in to continue'
      redirect_to new_user_session_path
    elsif invite.revoked?
      flash[:alert] = 'The invite could not be used because it has been revoked'
      redirect_to new_user_session_path
    elsif request.method == 'GET'
      accept_new_action(invite)
    elsif request.method == 'POST'
      accept_create_action(invite)
    end
  end

  def revoke
    invite = Invite.find_by!(id: params[:id])
    invite.revoke!

    flash[:success] = 'The invite was sucessfully revoked'
    redirect_to invites_path
  end

  private
  def authorize
    authorize! :manage, :user_invites
  end

  def accept_new_action(invite)
    user = User.new
    render(layout: "empty", locals: { user: user, invite: invite })
  end

  def accept_create_action(invite)
    user = User.new

    result = true
    ActiveRecord::Base.transaction do
      venues = invite.venue_ids.map { |id| Venue.find_by(id: id) }.compact

      existing_email_address = EmailAddress.find_by(email: invite.email)
      if existing_email_address && !existing_email_address.assigned_to_user?
        email_address = existing_email_address
      else
        email_address = EmailAddress.new(email: invite.email)
      end


      result = user.update_attributes(
        user_params.merge(
          email_address: email_address,
          role: invite.role,
          invite: invite
        )
      )
      if result
        venues.each do |venue|
          user.venue_users.create!(venue: venue)
        end

        invite.transition_to!(:accepted)
      else
        if user.errors["email_address.email"].present?
          user.errors["email_address.email"].each do |error_message|
            user.errors.add(:base, "Email #{error_message}")
          end
        end
      end

      raise ActiveRecord::Rollback unless result
    end

    if result
      sign_in(:user, user)
      redirect_to root_path
    else
      flash.now[:error] = "There was a problem accepting this invite"
      render action: 'accept', locals: { user: user, invite: invite }
    end
  end

  def invite_params
    params[:invite][:venue_ids] = Array(params[:invite][:venue_ids]).map do |id|
      if id.present?
        Integer(id)
      end
    end.compact

    permitted_params = [:email]

    if role_from_params == User::MANAGER_ROLE
      permitted_params << { venue_ids: [] }
    end

    if current_user.can_create_roles.include?(role_from_params)
      permitted_params << :role
    end

    params.require(:invite).permit(permitted_params)
  end

  def user_params
    params.require(:user).permit(
      :password,
      name_attributes: [:first_name, :surname]
    )
  end


  def role_from_params
    params[:invite][:role]
  end
end
