class PoolLoftTableSessionEdit < ActiveRecord::Base
  validates :guid, presence: true
  validates :table_id, numericality: { integer_only: 0, greater_than_or_equal_to: 0 }
  validates :table_guid, presence: true
  validates :table_name, presence: true
  validates :table_type, inclusion: { in: PoolLoftTableTypes }
  validates :table_session_id, numericality: { integer_only: 0, greater_than_or_equal_to: 0 }
  validates :admin_token_id, numericality: { integer_only: 0, greater_than_or_equal_to: 0 }
  validates :admin_token_guid, presence: true
  validates :old_duration_seconds,  numericality: { integer_only: 0, greater_than_or_equal_to: 0 }
  validates :new_duration_seconds,  numericality: { integer_only: 0, greater_than_or_equal_to: 0 }
end
