class UsersController < ApplicationController
  def show
    user = User.find(params[:id])
    render locals: { user: user }
  end

  def index
    filter = UsersIndexFilter.new(params[:filter])
    users = filter.query.all
    render locals: { filter: filter, users: users }
  end

  def edit_personal_details
    user = User.find(params[:id])
    render locals: { user: user }
  end

  def update_personal_details
    user = User.find(params[:id])
    if user.update_attributes(user_params(user))
      flash[:success] = 'User updated successfully'
      redirect_to user_path(user)
    else
      flash.now[:error] = 'There was an issue updating this user'
      render 'edit_personal_details', locals: { user: user }
    end
  end

  private
  def user_params(user)
    params.
      require(:user).
      permit(
        name_attributes: [:first_name, :surname],
        email_address_attributes: [:email]
      ).deep_merge(
        name_attributes: { id: user.name.id },
        email_address_attributes: { id: user.email_address.id }
      )
  end
end
