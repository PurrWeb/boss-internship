class FirstNameOption < ActiveRecord::Base
  belongs_to :first_name_group

  validates :first_name_group, presence: true
  validates :name, presence: true
end
