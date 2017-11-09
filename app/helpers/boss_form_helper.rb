
module BossFormHelper
  include ActionView::Helpers::TagHelper
  
  def boss_form_for(name, *args, &block)
    options = args.extract_options!
    args << options.merge(builder: BossFormBuilder)
    form_for(name, *args, &block)
  end
end
