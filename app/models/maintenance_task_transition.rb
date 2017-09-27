class MaintenanceTaskTransition < ActiveRecord::Base
  # Plugins
  include Statesman::Adapters::ActiveRecordTransition

  # Associations
  belongs_to :maintenance_task, inverse_of: :maintenance_task_transitions
  belongs_to :requester_user

  def requester_user
    user_id = metadata['requester_user_id']

    if user_id.present?
      User.find_by(id: user_id)
    else
      nil
    end
  end
end
