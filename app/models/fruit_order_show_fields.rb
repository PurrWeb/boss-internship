class FruitOrderShowFields
  def initialize(fruit_orders)
    @fields = FruitOrder::FIELDS.select do |field|
      fruit_orders.to_a.sum { |fo| fo.public_send(field) } > 0
    end
  end

  def each(&block)
    fields.each(&block)
  end

  private
  attr_reader :fields
end
