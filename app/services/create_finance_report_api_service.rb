class CreateFinanceReportApiService
  Result = Struct.new(:success, :finance_report, :api_errors) do
    def success?
      success
    end
  end

  def initialize(requester:, ability: UserAbility.new(requester))
    @requester = requester
    @ability = ability
  end

  attr_reader :requester, :ability

  def call(params:)
    ability.authorize!(:complete, :finance_report)

    result = SaveFinanceReport.new(
      staff_member: params.fetch(:staff_member),
      week: params.fetch(:week)
    ).call

    api_errors = nil
    unless result.success?
      api_errors = FinanceReportApiErrors.new(finance_report: result.finance_report)
    end
    Result.new(result.success?, result.finance_report, api_errors)
  end
end
