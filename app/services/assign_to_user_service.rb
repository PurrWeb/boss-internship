class AssignToUserService
  attr_reader :current_user, :marketing_task, :params
  attr_accessor :errors

  def initialize(current_user, marketing_task, params)
    @current_user = current_user
    @marketing_task = marketing_task
    @params = params
    @errors = {}
  end

  def assign
    validate_assign_to_user

    return false if invalid?

    marketing_task.update(assigned_to_user_id: assigned_user_id)
  end

  def valid?
    errors.keys.blank?
  end

  def invalid?
    !valid?
  end

  private

  def validate_assign_to_user
    if !params[:assign_to_self] && !assign_to_user_present?
      errors[:assign_to_user] = ['assigning user is required']
    end
  end

  def assign_to_user_present?
    params[:assign_to_user_id].present? && User.find_by(params[:assign_to_user_id]).present?
  end

  def assigned_user_id
    if params[:assign_to_self]
      current_user.id
    elsif assign_to_user_present?
      params[:assign_to_user_id]
    end
  end
end
