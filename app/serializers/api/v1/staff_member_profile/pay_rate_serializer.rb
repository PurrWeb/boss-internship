class Api::V1::StaffMemberProfile::PayRateSerializer < ActiveModel::Serializer
  attributes \
    :id,
    :name

  def name
    if !object.editable_by?(scope)
      object.name
    else
      result = ""
      if object.admin?
        result = result + "Admin | "
      end
      result = result + object.name.to_s
      result = result + " ("
      result = result + object.text_description
      result = result + ")"
      result
    end
  end
end  
