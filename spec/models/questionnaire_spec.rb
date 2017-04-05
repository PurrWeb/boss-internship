require 'rails_helper'

RSpec.describe Questionnaire, type: :model do
  it { should have_and_belong_to_many :venues }
  it { should have_and_belong_to_many :questionnaire_categories }
  it { should have_many :questionnaire_questions }
end
