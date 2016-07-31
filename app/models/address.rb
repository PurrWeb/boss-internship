class Address < ActiveRecord::Base
  has_one :staff_member, inverse_of: :address

  validates  :address, presence: true
  validates :county, presence: true
  validates :country, presence: true
  validates  :postcode, presence: true

  auto_strip_attributes :address, convert_non_breaking_spaces: true, squish: false
  auto_strip_attributes :county, convert_non_breaking_spaces: true, squish: true
  auto_strip_attributes :country, convert_non_breaking_spaces: true, squish: true
  auto_strip_attributes :postcode, convert_non_breaking_spaces: true, squish: true

  def ==(other)
    address == other.address &&
      county == other.county &&
      country == other.country &&
      postcode == other.postcode
  end
end
