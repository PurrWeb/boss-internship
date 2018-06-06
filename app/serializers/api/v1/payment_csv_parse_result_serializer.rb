class Api::V1::PaymentCsvParseResultSerializer < ActiveModel::Serializer
  attributes :resultType, :titleRowErrors, :headerRowErrors, :headerRows

  def resultType
    'parse_error'
  end

  def headerRows
    object.fetch(:header_rows)
  end

  def titleRowErrors
    object.fetch(:title_row_errors)
  end

  def headerRowErrors
    object.fetch(:header_row_errors)
  end
end
