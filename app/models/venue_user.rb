class VenueUser < ActiveRecord::Base
  belongs_to :user
  belongs_to :venue

  after_initialize :default_values

  private
  def default_values
    if self.new_record?
        self.enabled = true if enabled.nil?
    end
  end
end
