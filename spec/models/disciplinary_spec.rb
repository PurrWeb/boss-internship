require 'rails_helper'

RSpec.describe Disciplinary, type: :model do
  let!(:staff_member) { FactoryGirl.create(:staff_member) }
  let!(:user) { FactoryGirl.create(:user) }

  subject {
    described_class.new(
      title: 'Title',
      note: 'Note',
      created_by_user: user,
      staff_member: staff_member,
      level: described_class.levels[:first_level]
    )
  }

  describe "Associations" do
    it { should belong_to(:staff_member) }
    it { should belong_to(:created_by_user) }
    it { should belong_to(:disabled_by_user) }
  end

  describe "Validations" do
    it { should validate_presence_of(:title) }
    it { should validate_presence_of(:level) }
    it { should validate_presence_of(:note) }
    it { should validate_presence_of(:staff_member) }
    it { should validate_presence_of(:created_by_user) }
  end

  it "is valid with valid attributes" do
    expect(subject).to be_valid
  end

  it "is not valid without a title" do
    subject.title = nil
    expect(subject).to_not be_valid
  end

  it "is not valid without a note" do
    subject.note = nil
    expect(subject).to_not be_valid
  end

  it "is not valid without a created_by_user" do
    subject.created_by_user = nil
    expect(subject).to_not be_valid
  end

  it "is not valid without a staff_member" do
    subject.staff_member = nil
    expect(subject).to_not be_valid
  end

  it "is not valid without a level" do
    subject.level = nil
    expect(subject).to_not be_valid
  end
end
