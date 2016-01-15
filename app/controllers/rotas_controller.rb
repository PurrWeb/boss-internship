class RotasController < ApplicationController
  before_action :authorize

  def prefilled_example
  end

  def empty_example
  end

  private
  def authorize
    authorize! :manage, :rotas
  end
end
