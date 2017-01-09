class AddPoolLoftApiKey < ActiveRecord::Migration
  class ApiKey < ActiveRecord::Base
  end

  def change
    change_table :api_keys do |t|
      t.string :key_type
    end

    ApiKey.find_all do |api_key|
      api_key.update_attribute(:key_type, 'boss')
    end

    change_column_null :api_keys, :key_type, false
  end
end
