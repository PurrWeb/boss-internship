require 'rails_helper'

RSpec.describe QuestionnaireQuestion, type: :model do
  it { should belong_to(:questionnaire_category) }
  it { validate_presence_of :text }
end
