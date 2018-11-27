class FruitOrderNotificationMailer < ApplicationMailer
  def completed_fruit_order_mail(to:, fruit_order_ids:)
    fruit_orders = FruitOrder.where(id: fruit_order_ids)
    generated_at = Time.zone.now
    time_stamp = generated_at.strftime('%d_%m_%Y_%H_%M')

    if fruit_orders.count > 0
      attachments["fruit_order_completion_#{time_stamp}.pdf"] = {
        mime_type: 'application/pdf',
        content: FruitOrderCompletionPDF.new(
          generated_at: generated_at,
          fruit_orders: fruit_orders
        ).render
      }

      mail(
        to: to,
        subject: "Fruit Order Completions #{generated_at.to_s(:human)}"
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
end
