class StaffTypesController < ApplicationController
  before_action :authorize

  def index
    staff_types = StaffType.all
    render locals: { staff_types: staff_types }
  end

  private
  def authorize
    authorize! :manage, :staff_types
  end

  def staff_type_params
    params.require(:staff_type).
      permit(:name).merge(
        creator: current_user
      )
  end
end
