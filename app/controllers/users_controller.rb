class UsersController < ApplicationController
  def show
    user = User.find(params[:id])
    render locals: { user: user }
  end

  def index
    users = User.all
    render locals: { users: users }
  end
end
