require 'rails_helper'

describe Rota do
  describe 'states' do
    specify 'initial state should be in_progress' do
      rota = Rota.new
      expect(rota).to be_in_progress
    end
  end
end
