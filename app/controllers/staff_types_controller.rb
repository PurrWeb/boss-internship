class StaffTypesController < ApplicationController
  def index
    staff_types = StaffType.all
    render locals: { staff_types: staff_types }
  end

  def new
  end
end
