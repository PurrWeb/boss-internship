class ChangeOrderNotificationMailer < ApplicationMailer
  def completed_change_order_mail(to:, change_order_ids:)
    change_orders = ChangeOrder.where(id: change_order_ids)
    generated_at = Time.zone.now
    time_stamp = generated_at.strftime('%d_%m_%Y_%H_%M')

    if change_orders.count > 0
      attachments["change_order_completion_#{time_stamp}.pdf"] = {
        mime_type: 'application/pdf',
        content: ChangeOrderCompletionPDF.new(
          generated_at: generated_at,
          change_orders: change_orders
        ).render
      }

      mail(
        to: to,
        subject: "Change Order Completions #{generated_at.to_s(:human)}"
      ) do |format|
        format.html do
          render locals: { generated_at: generated_at }
        end

        format.text do
          render locals: { generated_at: generated_at }
        end
      end
    end
  end

  private
  attr_reader :user_id, :venue_name
end
