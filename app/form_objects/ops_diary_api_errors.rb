class OpsDiaryApiErrors
  def initialize(ops_diary:)
    @ops_diary = ops_diary
  end
  attr_reader :ops_diary

  def errors
    result = {}
    result[:base] = ops_diary.errors[:base] if ops_diary.errors[:base].present?
    result[:title] = ops_diary.errors[:title] if ops_diary.errors[:title].present?
    result[:text] = ops_diary.errors[:text] if ops_diary.errors[:text].present?
    result[:venue] = ops_diary.errors[:venue] if ops_diary.errors[:venue].present?
    result[:priority] = ops_diary.errors[:priority] if ops_diary.errors[:priority].present?

    result
  end
end
