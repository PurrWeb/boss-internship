class StaffMemberTransition < ActiveRecord::Base
  include Statesman::Adapters::ActiveRecordTransition

  belongs_to :staff_member, inverse_of: :staff_member_transitions
end
