class Address < ActiveRecord::Base
  has_one :staff_member, inverse_of: :address

  validate  :address_fields_valid
  validates :region, presence: true
  validates :country, presence: true
  validates  :postcode, presence: true

  def ==(other)
    address_1 == other.address_1 &&
      address_2 == other.address_2 &&
      address_3 == other.address_3 &&
      address_4 == other.address_4 &&
      region == other.region &&
      country == other.country &&
      postcode == other.postcode
  end

  def address_fields_valid
    if !(address_1.present? || address_2.present? || address_3.present? || address_4.present?)
      errors.add(:base, 'must be supplied')
    end
  end
end
