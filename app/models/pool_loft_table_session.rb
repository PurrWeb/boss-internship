class PoolLoftTableSession < ActiveRecord::Base
  validates :guid, presence: true
  validates :table_id, numericality: { integer_only: 0, greater_than_or_equal_to: 0 }
  validates :table_guid, presence: true
  validates :table_name, presence: true
  validates :table_type, inclusion: { in: PoolLoftTable::TABLE_TYPES }
  validates :edited_by_admin, inclusion: { in: [true, false] }
  validates :starts_at, presence: true
  validates :duration_seconds, numericality: { integer_only: true, greater_than_or_equal_to: 0 }
end
