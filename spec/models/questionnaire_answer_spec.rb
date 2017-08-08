require 'rails_helper'

RSpec.describe QuestionnaireAnswer, type: :model do
  extend ActionDispatch::TestProcess

  it { is_expected.to have_many :uploads }
  it { is_expected.to belong_to :questionnaire_response }
  it { is_expected.to belong_to :questionnaire_question }
end
