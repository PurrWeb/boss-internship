module BossLayoutHelper
  include ActionView::Helpers::TagHelper

  def boss_dashboard(&block)
    content_tag(:div, class: 'boss-page-main__dashboard') do
      content_tag(:div, class: 'boss-page-main__inner') do
        block.call
      end
    end
  end

  def boss_main_content(&block)
    content_tag(:div, class: 'boss-page-main__content') do
      content_tag(:div, class: 'boss-page-main__inner') do
        block.call
      end
    end
  end

  def boss_content_isle(number: 1, &block)
    content_tag(:div, class: 'boss-page-main__isle') do
      content_tag(:div, class: 'boss-details') do
        content_tag(:p, class: 'boss-details__pointer') do
          content_tag(:span, class: 'boss-details__pointer-text') do
            "#{number}"
          end
        end + 
        content_tag(:div, class: 'boss-details__content') do
          block.call
        end
      end
    end
  end
  
  def table_cell(label, &block)
    content_tag(:div, class: 'boss-table__cell') do
      content_tag(:div, class: 'boss-table__info') do
        content_tag(:p, class: 'boss-table__label') do
          label
        end + block.call
      end
    end
  end

  def table_cell_text(label, &block)
    table_cell(label) do
      content_tag(:p, class: "boss-table__text boss-table__text_adjust_wrap") do
        block.call
      end
    end
  end

  def table_cell_action(label, &block)
    table_cell(label) do
      content_tag(:p, class: 'boss-table__actions') do
        block.call
      end
    end
  end

  def page_entries_info(collection, options = {})
    entry_name = options[:entry_name] || (collection.empty?? 'entry' : collection.first.class.name.underscore.sub('_', ' '))
    if collection.total_pages < 2
      case collection.size
      when 0
        page_info_wrapper do
          page_info_item_wrapper do
            "No #{entry_name.pluralize} found"
          end
        end
      when 1
        page_info_wrapper do
          page_info_item_wrapper do
            "Displaying "
          end + 
          page_info_item_bold_wrapper do
            1
          end + 
          page_info_item_wrapper do
            " #{entry_name}"
          end
        end
      else
        page_info_wrapper do
          page_info_item_wrapper do
            "Displaying "
          end + 
          page_info_item_bold_wrapper do
            "all #{collection.size}"
          end + 
          page_info_item_wrapper do
            " #{entry_name.pluralize}"
          end
        end
      end
    else
      page_info_wrapper do
        page_info_item_wrapper do
          "Showing "
        end + 
        page_info_item_bold_wrapper do
          "#{collection.offset + 1}"
        end + 
        page_info_item_wrapper do
          "-"
        end + 
        page_info_item_bold_wrapper do
          "#{collection.offset + collection.length}"
        end + 
        page_info_item_wrapper do
          " of "
        end + 
        page_info_item_bold_wrapper do
          " #{collection.total_entries}"
        end
      end
    end
  end

  private
  def page_info_wrapper(&block)
    content_tag(:div, { class: 'boss-page-main__count boss-page-main__count_space_large' }) do
      block.call
    end
  end

  def page_info_item_wrapper(&block)
    content_tag(:span, { class: 'boss-page-main__count-text' }) do
      block.call
    end
  end

  def page_info_item_bold_wrapper(&block)
    content_tag(:span, { class: 'boss-page-main__count-text boss-page-main__count-text_marked' }) do
      block.call
    end
  end
end
