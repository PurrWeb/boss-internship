require 'rails_helper'

describe VenueMessagesDashboardQuery do
  let(:now) { Time.current }
  let(:venue) do
    FactoryGirl.create(:venue)
  end

  let(:user) { FactoryGirl.create(:user, venues: [venue]) }

  let(:query) do
    VenueMessagesDashboardQuery.new(venue: venue)
  end

  let(:message_display_limit) { VenueMessagesDashboardQuery::MESSAGE_DISPLAY_LIMIT }

  context 'before call' do
    it "query should'nt return messages" do
      expect(query.all.count).to eq(0)
    end
  end

  describe 'disabling messages' do
    before do
      dashboard_messages
    end

    context 'active messages equal to display limit' do
      let(:dashboard_messages) do
        Array.new(message_display_limit) do |index|
          FactoryGirl.create(
            :dashboard_message,
            created_by_user: user,
            venues: [venue],
            published_time: now - index.seconds
          )
        end
      end

      specify 'query should return messages capped by display limit' do
        expect(query.all.count).to eq(message_display_limit)
      end

      specify "query should return -1 message after disable" do
        dashboard_messages.last.disable(user)
        expect(query.all.count).to eq(message_display_limit - 1)
      end
    end

    context 'more active messages exist than display limit' do
      let(:recent_messages) do
        Array.new(message_display_limit) do |index|
          FactoryGirl.create(
            :dashboard_message,
            created_by_user: user,
            venues: [venue],
            published_time: now - index.seconds
          )
        end
      end
      let(:older_messages) do
        Array.new(2) do |index|
          FactoryGirl.create(
            :dashboard_message,
            created_by_user: user,
            venues: [venue],
            published_time: now - 1.day - index.seconds
          )
        end
      end
      let(:dashboard_messages) do
        recent_messages + older_messages
      end

      let(:total_message_count) { message_display_limit }

      specify 'query should return messages capped by display limit' do
        expect(query.all.count).to eq(message_display_limit)
      end

      specify 'should return all new messages in order' do
        returned_messages = query.all.to_a
        index = 0
        recent_messages.each_with_index do |message, index|
          expect(returned_messages[index]).to eq(message)
        end
      end

      specify 'should not return older messages' do
        returned_messages = query.all.to_a
        older_messages.each do |message|
          expect(recent_messages).to_not include(message)
        end
      end

      context 'after displaying recent message' do
        before do
          recent_messages.last.disable(user)
        end

        specify "query should still return message limit" do
          expect(query.all.count).to eq(message_display_limit)
        end

        specify 'most recent old message should be returned' do
          returned_messages = query.all.to_a
          expect(returned_messages).to include(older_messages.first)
        end
      end
    end
  end
end