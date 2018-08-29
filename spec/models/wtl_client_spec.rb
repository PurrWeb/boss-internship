require "rails_helper"

RSpec.describe WtlClient, type: :model do
  let!(:wtl_card) { FactoryGirl.create(:wtl_card, number: card_number) }
  let!(:date_of_birth) { 33.years.ago.to_date }
  let!(:university) { WtlClient::UNIVERSITIES[0] }
  let!(:wrong_university) { "Wrong university" }
  let!(:gender) { WtlClient::GENDERS[0] }
  let!(:wrong_gender) { "Wrong gender" }
  let!(:email) { "some@email.com" }
  let!(:wrong_email) { "somewrongemail.com" }
  let!(:card_number) { "123456" }
  let!(:wrong_card_number) { "Wrong card number" }

  subject {
    described_class.new(
      first_name: "John",
      surname: "Doe",
      date_of_birth: date_of_birth,
      university: university,
      gender: gender,
      email: email,
      card_number: card_number,
    )
  }

  describe "Associations" do
    it { should belong_to(:wtl_card) }
  end

  describe "Validations" do
    it { should validate_presence_of(:first_name) }
    it { should validate_presence_of(:surname) }
    it { should validate_presence_of(:date_of_birth) }
    it { should validate_presence_of(:email) }
    it { should validate_inclusion_of(:gender).in_array(WtlClient::GENDERS) }
    it { should validate_inclusion_of(:university).in_array(WtlClient::UNIVERSITIES) }
  end

  it "is valid with valid attributes" do
    expect(subject).to be_valid
  end

  it "is not valid without a first_name" do
    subject.first_name = nil
    expect(subject).to_not be_valid
  end

  it "is not valid without a surname" do
    subject.surname = nil
    expect(subject).to_not be_valid
  end

  it "is not valid without a date_of_birth" do
    subject.date_of_birth = nil
    expect(subject).to_not be_valid
  end

  it "is not valid without a gender" do
    subject.gender = nil
    expect(subject).to_not be_valid
  end

  it "is not valid without a email" do
    subject.email = nil
    expect(subject).to_not be_valid
  end

  it "is not valid with wrong email" do
    subject.email = wrong_email
    expect(subject).to_not be_valid
  end

  it "is not valid with wrong gender" do
    subject.gender = wrong_gender
    expect(subject).to_not be_valid
  end

  it "is not valid without a university" do
    subject.university = nil
    expect(subject).to_not be_valid
  end

  it "is not valid with wrong university" do
    subject.university = wrong_university
    expect(subject).to_not be_valid
  end

  it "is not valid without a card_number" do
    subject.card_number = nil
    expect(subject).to_not be_valid
  end

  it "is not valid with wrong card_number" do
    subject.card_number = wrong_card_number
    expect(subject).to_not be_valid
  end
end
