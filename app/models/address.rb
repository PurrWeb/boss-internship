class Address < ActiveRecord::Base
  validate  :address_fields_valid
  validates :region, presence: true
  validates :country, presence: true
  validates  :postcode, presence: true

  def address_fields_valid
    if !(address_1.present? || address_2.present? || address_3.present? || address_4.present?)
      errors.add(:base, 'must be supplied')
    end
  end
end
