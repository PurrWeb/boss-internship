class SaveDeadlineOnChangeOrders < ActiveRecord::Migration
  def change
    change_table :change_orders do |t|
      t.datetime :submission_deadline
      t.index :submission_deadline
    end

    ActiveRecord::Base.transaction do
      ChangeOrder.all.each do |change_order|
        change_order.update_attributes!(submission_deadline: change_order.submission_deadline.time)
      end
    end

    change_column_null :change_orders, :submission_deadline, false

    change_table :change_orders do |t|
      t.remove :date
    end
  end
end
