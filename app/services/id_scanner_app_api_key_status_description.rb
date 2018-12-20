class IdScannerAppApiKeyStatusDescription
  def initialize(id_scanner_app_api_key:)
    @id_scanner_app_api_key = id_scanner_app_api_key
  end
  attr_reader :id_scanner_app_api_key

  def call
    id_scanner_app_api_key.enabled? ? 'Active' : 'Disabled'
  end
end
