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
end
