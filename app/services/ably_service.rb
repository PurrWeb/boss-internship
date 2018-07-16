class AblyService
  def initialize(
    security_app_ably_service: SecurityAppAblyService.new
  )
    @security_app_ably_service = security_app_ably_service
  end

  def security_app_data_update(updates:, deletes:)
    security_app_ably_service.security_app_data_update(updates: updates, deletes: deletes)
  end

  private
  attr_reader :security_app_ably_service
end