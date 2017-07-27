class CheckListSubmissionSerializer < ActiveModel::Serializer
  attributes :created_at, :check_list_name, :venue_name, :creator_name, :creator_id, :answers

  def venue_name
    object.venue.name
  end

  def creator_name
    object.user.full_name
  end

  def creator_id
    object.user.id
  end

  def check_list_name
    object.name
  end

  def answers
    object.check_list_submission_answers
  end
end
