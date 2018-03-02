class CreatePaymentTransitions < ActiveRecord::Migration
  def change
    create_table :payment_transitions do |t|
      t.string :to_state, null: false
      t.text :metadata
      t.integer :sort_key, null: false
      t.integer :payment_id, null: false
      t.boolean :most_recent
      t.timestamps null: false
    end

    add_index(:payment_transitions,
              [:payment_id, :sort_key],
              unique: true,
              name: "index_payment_transitions_parent_sort")
    add_index(:payment_transitions,
              [:payment_id, :most_recent],
              unique: true,
              
              name: "index_payment_transitions_parent_most_recent")
  end
end
