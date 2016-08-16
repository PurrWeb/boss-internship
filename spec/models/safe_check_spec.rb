require 'rails_helper'

describe SafeCheck do
  describe 'validations' do
    let(:safe_check) { SafeCheck.new }

    describe "#fifty_pound_note_pounds" do
      before do
        safe_check.fifty_pound_note_pounds = value
        safe_check.valid?
      end

      context 'when negative value is supplied' do
        let(:value) { -1 }

        specify do
          expect(
            safe_check.errors["fifty_pound_note_pounds"]
          ).to include("must be greater than or equal to 0")
        end
      end

      context 'when multiple of 50 is supplied' do
        let(:value) { 450 }

        specify do
          expect(
            safe_check.errors["fifty_pound_note_pounds"]
          ).to eq([])
        end
      end

      context 'when non multiple of 50 is supplied' do
        let(:value) { 49 }

        specify do
          expect(
            safe_check.errors["fifty_pound_note_pounds"]
          ).to include("must be multiple of £50")
        end
      end
    end

    describe "#twenty_pound_note_pounds" do
      before do
        safe_check.twenty_pound_note_pounds = value
        safe_check.valid?
      end

      context 'when negative value is supplied' do
        let(:value) { -1 }

        specify do
          expect(
            safe_check.errors["twenty_pound_note_pounds"]
          ).to include("must be greater than or equal to 0")
        end
      end

      context 'when multiple of 20 is supplied' do
        let(:value) { 80 }

        specify do
          expect(
            safe_check.errors["twenty_pound_note_pounds"]
          ).to eq([])
        end
      end

      context 'when non multiple of 20 is supplied' do
        let(:value) { 49 }

        specify do
          expect(
            safe_check.errors["twenty_pound_note_pounds"]
          ).to include("must be multiple of £20")
        end
      end
    end

    describe "#ten_pound_note_pounds" do
      before do
        safe_check.ten_pound_note_pounds = value
        safe_check.valid?
      end

      context 'when negative value is supplied' do
        let(:value) { -1 }

        specify do
          expect(
            safe_check.errors["ten_pound_note_pounds"]
          ).to include("must be greater than or equal to 0")
        end
      end

      context 'when multiple of 10 is supplied' do
        let(:value) { 70 }

        specify do
          expect(
            safe_check.errors["ten_pound_note_pounds"]
          ).to eq([])
        end
      end

      context 'when non multiple of 10 is supplied' do
        let(:value) { 49 }

        specify do
          expect(
            safe_check.errors["ten_pound_note_pounds"]
          ).to include('must be multiple of £10')
        end
      end
    end

    describe "#five_pound_note_pounds" do
      before do
        safe_check.five_pound_note_pounds = value
        safe_check.valid?
      end

      context 'when negative value is supplied' do
        let(:value) { -1 }

        specify do
          expect(
            safe_check.errors["five_pound_note_pounds"]
          ).to include("must be greater than or equal to 0")
        end
      end

      context 'when multiple of 5 is supplied' do
        let(:value) { 45 }

        specify do
          expect(
            safe_check.errors["five_pound_note_pounds"]
          ).to eq([])
        end
      end

      context 'when non multiple of 5 is supplied' do
        let(:value) { 49 }

        specify do
          expect(
            safe_check.errors["five_pound_note_pounds"]
          ).to include("must be multiple of £5")
        end
      end
    end

    describe "#two_pound_coins_pounds" do
      before do
        safe_check.two_pound_coins_pounds = value
        safe_check.valid?
      end

      context 'when negative value is supplied' do
        let(:value) { -1 }

        specify do
          expect(
            safe_check.errors["two_pound_coins_pounds"]
          ).to include("must be greater than or equal to 0")
        end
      end

      context 'when multiple of 2 is supplied' do
        let(:value) { 88 }

        specify do
          expect(
            safe_check.errors["two_pound_coins_pounds"]
          ).to eq([])
        end
      end

      context 'when non multiple of 2 is supplied' do
        let(:value) { 49 }

        specify do
          expect(
            safe_check.errors["two_pound_coins_pounds"]
          ).to include("must be multiple of £2")
        end
      end
    end

    describe "#one_pound_coins_pounds" do
      before do
        safe_check.one_pound_coins_pounds = value
        safe_check.valid?
      end

      context 'when negative value is supplied' do
        let(:value) { -1 }

        specify do
          expect(
            safe_check.errors["one_pound_coins_pounds"]
          ).to include("must be greater than or equal to 0")
        end
      end

      context 'when integer is supplied' do
        let(:value) { 83 }

        specify do
          expect(
            safe_check.errors["one_pound_coins_pounds"]
          ).to eq([])
        end
      end

      context 'when non integer is supplied' do
        let(:value) { 49.1 }

        specify do
          expect(
            safe_check.errors["one_pound_coins_pounds"]
          ).to include("must be an integer")
        end
      end
    end

    describe "#fifty_pence_coins_cents" do
      before do
        safe_check.fifty_pence_coins_cents = value
        safe_check.valid?
      end

      context 'when negative value is supplied' do
        let(:value) { -1 }

        specify do
          expect(
            safe_check.errors["fifty_pence_coins_cents"]
          ).to include("must be greater than or equal to 0")
        end
      end

      context 'when 0 is supplied' do
        let(:value) { 0 }

        specify do
          expect(
            safe_check.errors["fifty_pence_coins_cents"]
          ).to eq([])
        end
      end

      context 'when mutiple of 50 is supplied' do
        let(:value) { 150 }

        specify do
          expect(
            safe_check.errors["fifty_pence_coins_cents"]
          ).to eq([])
        end
      end

      context 'when non multiple of 50 is supplied' do
        let(:value) { 349 }

        specify do
          expect(
            safe_check.errors["fifty_pence_coins_cents"]
          ).to include("must be multiple of 50p")
        end
      end
    end

    describe "#twenty_pence_coins_cents" do
      before do
        safe_check.twenty_pence_coins_cents = value
        safe_check.valid?
      end

      context 'when negative value is supplied' do
        let(:value) { -1 }

        specify do
          expect(
            safe_check.errors["twenty_pence_coins_cents"]
          ).to include("must be greater than or equal to 0")
        end
      end

      context 'when 0 is supplied' do
        let(:value) { 0 }

        specify do
          expect(
            safe_check.errors["twenty_pence_coins_cents"]
          ).to eq([])
        end
      end

      context 'when mutiple of 20 is supplied' do
        let(:value) { 120 }

        specify do
          expect(
            safe_check.errors["twenty_pence_coins_cents"]
          ).to eq([])
        end
      end

      context 'when non multiple of 20 is supplied' do
        let(:value) { 349 }

        specify do
          expect(
            safe_check.errors["twenty_pence_coins_cents"]
          ).to include("must be multiple of 20p")
        end
      end
    end

    describe "#ten_pence_coins_cents" do
      before do
        safe_check.ten_pence_coins_cents = value
        safe_check.valid?
      end

      context 'when negative value is supplied' do
        let(:value) { -1 }

        specify do
          expect(
            safe_check.errors["ten_pence_coins_cents"]
          ).to include("must be greater than or equal to 0")
        end
      end

      context 'when 0 is supplied' do
        let(:value) { 0 }

        specify do
          expect(
            safe_check.errors["ten_pence_coins_cents"]
          ).to eq([])
        end
      end

      context 'when mutiple of 10 is supplied' do
        let(:value) { 120 }

        specify do
          expect(
            safe_check.errors["ten_pence_coins_cents"]
          ).to eq([])
        end
      end

      context 'when non multiple of 10 is supplied' do
        let(:value) { 349 }

        specify do
          expect(
            safe_check.errors["ten_pence_coins_cents"]
          ).to include("must be multiple of 10p")
        end
      end
    end

    describe "#five_pence_coins_cents" do
      before do
        safe_check.five_pence_coins_cents = value
        safe_check.valid?
      end

      context 'when negative value is supplied' do
        let(:value) { -1 }

        specify do
          expect(
            safe_check.errors["five_pence_coins_cents"]
          ).to include("must be greater than or equal to 0")
        end
      end

      context 'when 0 is supplied' do
        let(:value) { 0 }

        specify do
          expect(
            safe_check.errors["five_pence_coins_cents"]
          ).to eq([])
        end
      end

      context 'when mutiple of 5 is supplied' do
        let(:value) { 115 }

        specify do
          expect(
            safe_check.errors["five_pence_coins_cents"]
          ).to eq([])
        end
      end

      context 'when non multiple of 5 is supplied' do
        let(:value) { 349 }

        specify do
          expect(
            safe_check.errors["five_pence_coins_cents"]
          ).to include("must be multiple of 5p")
        end
      end
    end
  end
end
