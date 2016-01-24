class RotaStatusTransition < ActiveRecord::Base
  include Statesman::Adapters::ActiveRecordTransition

  belongs_to :rota, inverse_of: :rota_status_transitions
end
