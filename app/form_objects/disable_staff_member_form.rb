class DisableStaffMemberForm < Reform::Form
  include Reform::Form::ActiveModel::ModelReflections

   property :never_rehire
   validates :never_rehire, inclusion: { in: [true, false] }

   property :disable_reason, virtual: true
   validates :disable_reason, presence: true

   def would_rehire
     !never_rehire if !(never_rehire.nil?)
   end
end
