class CheckList < ActiveRecord::Base
  has_many :check_list_items
  belongs_to :venue

  validates :venue, presence: true
end
