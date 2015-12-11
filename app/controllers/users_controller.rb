class UsersController < ApplicationController
  def show
    user = User.find(params[:id])
    render locals: { user: user }
  end

  def index
    users = User.all
    render locals: { users: users }
  end

  def new
    user = User.new
    render locals: { user: user }
  end

  def create
    user = User.new(user_params)

    if user.save
      flash[:success] = "User added successfully"
      redirect_to action: :index
    else
      flash.now[:error] = "There was a problem creating this user"
      render 'new', locals: { user: user }
    end
  end

  private
  def user_params
    params.require(:user).permit(
      :password,
      :role,
      email_address_attributes: :email,
      name_attributes: [
        :first_name,
        :surname
      ]
    )
  end
end
