class CheckListItem < ActiveRecord::Base
  belongs_to :check_list

  validates :check_list, presence: true
end
