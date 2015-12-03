class UsersController < ApplicationController
  def index
    users = User.all
    render locals: { users: users }
  end
end
