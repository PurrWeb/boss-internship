module FruitOrderHelper
  def fruit_order_fields_with_value(fruit_order)
    fruit_order.fields_with_value.map do |field|
      {
        name: FruitOrder.message_for(field),
        number: fruit_order.public_send(field)
      }
    end
  end
end
