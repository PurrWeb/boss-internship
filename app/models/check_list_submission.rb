class CheckListSubmission < ActiveRecord::Base
  SUBMISSIONS_PER_PAGE = 5
  
  belongs_to :user
  belongs_to :venue
  has_many :check_list_submission_answers, validate: false

  validates :venue, presence: true
  validates :user, presence: true
  validates :name, presence: true
  validate do |submission|
    submission.check_list_submission_answers.each_with_index do |answer, key|
      next if answer.valid?
      answer.errors.each do |attribute, error|
        errors.add(attribute, {index: key, message: "#{error}"})
      end
    end

    if submission.errors.present?
      errors.add(:base, :invalid, message: "More Information is needed to continue. Please fill in notes to explain any items in the list that could not be completed")
    end
  end
  
  scope :status_ok, -> {
    ids = joins(:check_list_submission_answers)
      .group('check_list_submissions.id')
      .having('SUM(check_list_submission_answers.answer = false) = 0').map(&:id)
    where(id: ids)
  }

  scope :status_problem, -> {
    ids = joins(:check_list_submission_answers)
      .group('check_list_submissions.id')
      .having('SUM(check_list_submission_answers.answer = false) > 0').map(&:id)
    where(id: ids)
  }
end
