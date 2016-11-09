class StaffTypesController < ApplicationController
  before_action :authorize

  def index
    staff_types = StaffType.all
    render locals: { staff_types: staff_types }
  end

  def update_colors
    ids = params["staff_type"].map{ |x| x.first }
    ids.each do |id|
      properties = update_color_params(params["staff_type"][id])
      type = StaffType.find(properties.fetch("id"))

      form_color = properties.fetch("ui_color")

      if color_valid?(form_color)
        type.update_attributes!(ui_color: form_color[1, form_color.length].upcase)
      else
        Rollbar.error("Invalid color #{form_color} encountered")
      end
    end

    flash[:success] = 'Update successful'
    redirect_to staff_types_path
  end

  private
  def authorize
    authorize! :manage, :admin
  end

  def color_valid?(form_color)
    form_color =~ hex_color_regex
  end

  def hex_color_regex
    /^\#[0-9a-fA-F]{6}$/
  end

  def update_color_params(properties)
    properties.permit(:id, :ui_color)
  end

  def staff_type_params
    params.require(:staff_type).
      permit(:name).merge(
        creator: current_user
      )
  end
end
