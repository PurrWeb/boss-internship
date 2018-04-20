class Api::V1::FinanceReports::StaffMemberSerializer < ActiveModel::Serializer

  attributes :id, :fullName, :staffTypeId

  def fullName
    object.full_name
  end

  def staffTypeId
    object.staff_type.id
  end
end
