class MigrateExistingAddressData < ActiveRecord::Migration
  def change
    ActiveRecord::Base.transaction do
      Address.find_each do |address|
        address.address = [
          address.address_1,
          address.address_2,
          address.address_3,
          address.address_4
        ].compact.join("\n")

        address.save!
      end
    end
  end
end
