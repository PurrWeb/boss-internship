module PdfHelper
  def use_ttf_font(pdf)
    pdf.font_families.update("Opensans" => {
      :normal => Rails.root.join('app', 'assets', 'fonts', 'OpenSans-Regular.ttf'),
      :bold => Rails.root.join('app', 'assets', 'fonts', 'OpenSans-Bold.ttf'),
      :italic => Rails.root.join('app', 'assets', 'fonts', 'OpenSans-Italic.ttf')
    })
    pdf.font "Opensans"
  end
end
