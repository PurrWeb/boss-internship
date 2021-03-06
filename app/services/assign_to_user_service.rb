class AssignToUserService
  Result = Struct.new(:success, :errors) do
    def success?
      success
    end
  end

  def initialize(requester, marketing_task, params)
    @requester = requester
    @marketing_task = marketing_task
    @params = params
    @ability = UserAbility.new(requester)
  end
  attr_reader :requester, :marketing_task, :params, :ability

  def call
    errors = {}
    validate_assign_to_user(errors)

    unassign_previous_user
    assign_new_user

    marketing_task.assign_attributes(assigned_to_user_id: assigned_user_id)

    #This should never be false in production
    ability.authorize!(:assign, marketing_task)

    result = false
    if errors.empty?
      result = marketing_task.save
    end

    Result.new(result, errors)
  end

  private

  def unassign_previous_user
    return if marketing_task.assigned_to_user.blank?

    marketing_task.marketing_task_assignments.new(
      user: marketing_task.assigned_to_user,
      state: MarketingTaskAssignment::UNASSIGNED
    )
  end

  def assign_new_user
    marketing_task.marketing_task_assignments.new(
      user_id: assigned_user_id,
      state: MarketingTaskAssignment::ASSIGNED
    )
  end

  def validate_assign_to_user(errors)
    if !params[:assign_to_self] && !assign_to_user_present?
      errors[:assign_to_user] = ['assigning user is required']
    end
  end

  def assign_to_user_present?
    params[:assign_to_user_id].present? && User.find_by(params[:assign_to_user_id]).present?
  end

  def assigned_user_id
    if params[:assign_to_self]
      requester.id
    elsif assign_to_user_present?
      params[:assign_to_user_id]
    end
  end
end
