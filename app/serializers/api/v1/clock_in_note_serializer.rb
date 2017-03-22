class Api::V1::ClockInNoteSerializer < ActiveModel::Serializer
  attributes :id, :note, :clock_in_day

  def clock_in_day
    { id: object.clock_in_day_id }
  end
end
