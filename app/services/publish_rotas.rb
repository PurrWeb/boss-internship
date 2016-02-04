class PublishRotas
  def initialize(rotas: rotas)
    @rotas = rotas
  end

  def call
    ActiveRecord::Base.transaction do
      rotas.each do |rota|
        if rota.new_record?
          rota.save!
        end

        if !rota.published?
          rota.transition_to!(:published)
        end
      end
    end
  end

  private
  attr_reader :rotas
end
