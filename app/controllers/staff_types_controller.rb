class StaffTypesController < ApplicationController
  before_action :authorize

  def index
    staff_types = StaffType.all
    render locals: { staff_types: staff_types }
  end

  def new
    staff_type = StaffType.new
    render locals: { staff_type: staff_type }
  end

  def create
    staff_type = StaffType.new(staff_type_params)

    if staff_type.save
      flash[:success] = 'Staff type added successfully'
      redirect_to staff_types_path
    else
      flash.now[:error] = 'Staff type could not be added'
      render 'new', locals: { staff_type: staff_type }
    end
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
