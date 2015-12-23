class InvitesController < ApplicationController
  skip_before_filter :authenticate_user!, only: [:accept]

  def index
    invites = Invite.all
    render locals: { invites: invites }
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
      flash[:warning] = 'The invite has already been used please sign in to continue'
      redirect_to new_user_session_path
    elsif request.method == 'GET'
      accept_new_action(invite)
    elsif request.method == 'POST'
      accept_create_action(invite)
    end
  end

  private
  def accept_new_action(invite)
    user = User.new
    render locals: { user: user, invite: invite }
  end

  def accept_create_action(invite)
    user = User.new

    result = true
    ActiveRecord::Base.transaction do
      email_address = EmailAddress.new(email: invite.email)
      result = user.update_attributes(user_params.merge(email_address: email_address, role: invite.role))
      result = result && invite.transition_to(:accepted)

      raise ActiveRecord::Rollbar unless result
    end

    if result
      sign_in(:user, user)
      redirect_to root_path
    else
      render action: 'accept', locals: { user: user, invite: invite }
    end
  end

  def invite_params
    permitted_params = [:email]

    if current_user.can_create_roles.include?(params[:invite][:role])
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
end
