class Users::PasswordsController < Devise::PasswordsController
  before_filter :set_new_layout

  # GET /resource/password/new
  # def new
  #   super
  # end

  # POST /resource/password
  def create
    email = params.fetch("user").fetch("email")
    user = User.enabled.with_email(email).first
    if user.present?
      super
    else
      # Fake success
      if !email.present?
        flash[:alert] = 'Email field is required'
        redirect_to new_user_password_path
      else
        flash[:notice] = 'You will receive an email with instructions on how to reset your password in a few minutes.'
        redirect_to new_user_session_path
      end
    end
  end

  # GET /resource/password/edit?reset_password_token=abcdef
  def edit
    user = User.with_reset_password_token(params[:reset_password_token])
    if user.present? && user.reset_password_sent_at.nil?
      flash[:alert] = 'The token could not be used because it expired.'
      redirect_to new_user_session_path
    else
      super
    end
  end

  # PUT /resource/password
   def update
    user = User.with_reset_password_token(params[:user][:reset_password_token])
    if user.present? && user.reset_password_sent_at.nil?
      flash[:alert] = 'The token could not be used because it expired.'
      redirect_to new_user_session_path
    else
      super
    end
   end

  # protected

  # def after_resetting_password_path_for(resource)
  #   super(resource)
  # end

  # The path used after sending reset password instructions
  # def after_sending_reset_password_instructions_path_for(resource_name)
  #   super(resource_name)
  # end

  def set_new_layout
    @current_layout = 'newLayout';
  end

  def setup_frontend_bundles
    @frontend_bundles = SourcemapHelper.bundles
  end
end
