require 'rails_helper'

RSpec.describe Questionnaire, type: :model do
  it { is_expected.to have_and_belong_to_many :venues }
end
