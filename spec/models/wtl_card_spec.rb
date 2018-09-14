require "rails_helper"

RSpec.describe WtlCard, :wtl, type: :model do
  let!(:card_number) { "123456" }

  subject {
    described_class.new(
      number: card_number,
    )
  }

  describe "Validations" do
    it { should validate_presence_of(:number) }
  end

  it "is valid with valid attributes" do
    expect(subject).to be_valid
  end

  it "is not valid without a number" do
    subject.number = nil
    expect(subject).to_not be_valid
  end
end
