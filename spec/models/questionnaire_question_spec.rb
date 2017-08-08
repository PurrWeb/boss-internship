require 'rails_helper'

RSpec.describe QuestionnaireQuestion, type: :model do
  it { should belong_to(:questionnaire_category) }
  it { should belong_to(:questionnaire) }
  it { validate_presence_of :text }
end
