class DisableStaffMemberForm < Reform::Form
  include Reform::Form::ActiveModel::ModelReflections

   property :never_rehire

   property :disable_reason, virtual: true
   validates :disable_reason, presence: true
end
