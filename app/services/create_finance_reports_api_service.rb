class CreateFinanceReportsApiService
  Result = Struct.new(:success, :finance_reports, :api_errors) do
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

    result = SaveFinanceReports.new(
      staff_members: params.fetch(:staff_members),
      week: params.fetch(:week)
    ).call

    api_errors = nil
    unless result.success?
      api_errors = FinanceReportsApiErrors.new(finance_report: result.finance_reports)
    end
    Result.new(result.success?, result.finance_reports, api_errors)
  end
end
