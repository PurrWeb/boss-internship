class CheckListSubmissionAnswer < ActiveRecord::Base
  belongs_to :check_list_submission

  validates :description, presence: true
  validates :check_list_submission, presence: true
  validate :enshure_note_set_if_answer_blank
  validate :enshure_note_characters_length

  def enshure_note_set_if_answer_blank
    if answer == false && note.blank?
      errors.add(:answer, 'Note Required')
    end
  end

  def enshure_note_characters_length
    if answer == false && note.present? && note.size > 255
      errors.add(:note, 'Note must be below 255 characters')
    end
  end
end
