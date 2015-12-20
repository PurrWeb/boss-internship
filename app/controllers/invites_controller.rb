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
    email_address = EmailAddress.new(email: invite.email)
    user = User.new(user_params.merge(email_address: email_address, role: invite.role))

    if user.save
      sign_in(:user, user)
      redirect_to root_path
    else
      render action: 'accept', locals: { user: user, invite: invite }
    end
  end

  def invite_params
    params.require(:invite).permit(
      :role,
      :email
    )
  end

  def user_params
    params.require(:user).permit(
      :password,
      name_attributes: [:first_name, :surname]
    )
  end
end
