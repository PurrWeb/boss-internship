require 'rails_helper'

describe ShiftChangeNotificationMailer do
  describe '#notify_of_shift_change_mail' do
    let(:date) { Time.now.beginning_of_week.to_date }
    let(:staff_member) { FactoryGirl.create(:staff_member) }
    let(:rota) { FactoryGirl.create(:rota, date: date + 2.days) }
    let!(:shift) do
      FactoryGirl.create(
        :rota_shift,
        rota: rota,
        staff_member: staff_member,
        starts_at: date + 2.days + 8.hours,
        ends_at: date + 2.days + 12.hours
      )
    end
    let(:mail) do
      ShiftChangeNotificationMailer.
        notify_of_shift_change_mail(staff_member_id: staff_member.id)
    end

    specify do
      mail.deliver_now
    end
  end
end
