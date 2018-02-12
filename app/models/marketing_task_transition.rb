class MarketingTaskTransition < ActiveRecord::Base
  include Statesman::Adapters::ActiveRecordTransition

  belongs_to :marketing_task, inverse_of: :marketing_task_transitions
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
