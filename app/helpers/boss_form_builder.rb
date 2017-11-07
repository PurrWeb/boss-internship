class BossFormBuilder < ActionView::Helpers::FormBuilder
    
  def field_wrapper(attribute, args, &block)
    @template.content_tag(:div, { class: 'boss-form__field' }) do
      @template.content_tag(:label, {class: 'boss-form__label', for: "field-#{attribute}"}) do
        @template.content_tag(:span, {class: 'boss-form__label-text'}) do
          args[:label]
        end + block.call
      end
    end
  end

  def text_field(attribute, args)
    field_wrapper(attribute, args) do
      super(attribute, args)
    end
  end

  def select(attribute, options, args, html_options = {})
    field_wrapper(attribute, args) do
      super(attribute, options, args)
    end
  end
  
end
