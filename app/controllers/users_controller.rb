class UsersController < ApplicationController
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
      flash[:message] = "User added successfully"
      redirect_to action: :index
    else
      flash.now[:error] = "There was a problem creating this user"
      render 'new', locals: { user: user }
    end
  end

  private
  def user_params
    params.require(:user).permit(
      :first_name,
      :sir_name,
      :email,
      :password,
      :role,
      :gender,
      :phone_number,
      :date_of_birth,
      address_attributes: [
        :address_1,
        :address_2,
        :address_3,
        :address_4,
        :postcode,
        :country,
        :region
      ]
    )
  end
end
