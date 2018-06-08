class ClockingNoteApiService
  Result = Struct.new(:success, :clocking_note, :api_errors) do
    def success?
      success
    end
  end

  def initialize(requester:, clocking_note:)
    @requester = requester
    @clocking_note = clocking_note
  end

  def create(params:)
    clocking_day_params = {
      venue: params.fetch(:venue),
      date: params.fetch(:date),
      staff_member: params.fetch(:staff_member),
    }

    note_params = {
      note: params.fetch(:note),
      enabled: true,
    }

    model_service_result = CreateClockingNote.new(
      requester: requester,
      clocking_day_params: clocking_day_params,
      clocking_note_params: note_params,
    ).call

    api_errors = nil
    unless model_service_result.success?
      api_errors = ClockingNoteApiErrors.new(clocking_note: model_service_result.clocking_note)
    end
    Result.new(model_service_result.success?, model_service_result.clocking_note, api_errors)
  end

  def update(note:)
    model_service_result = UpdateClockingNote.new(
      clocking_note: clocking_note,
      requester: requester,
      note: note,
    ).call

    api_errors = nil
    unless model_service_result.success?
      api_errors = ClockingNoteApiErrors.new(clocking_note: model_service_result.clocking_note)
    end
    Result.new(model_service_result.success?, model_service_result.clocking_note, api_errors)
  end

  attr_reader :requester, :clocking_note
end
