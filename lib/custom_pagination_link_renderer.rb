class CustomPaginationLinkRenderer < WillPaginate::ActionView::LinkRenderer
  protected

  def page_number(page)
    if page == 1 && page != current_page
      if current_page == total_pages
        link(page, page, class: 'boss-paginator__action boss-paginator__action_role_total')
      else
        link(page, page, class: 'boss-paginator__action')
      end
    elsif page == current_page
      if page == total_pages
        link(page, page, class: 'boss-paginator__action boss-paginator__action_role_current boss-paginator__action_state_active boss-paginator__action_role_total')
      else
        link(page, page, class: 'boss-paginator__action boss-paginator__action_role_current boss-paginator__action_state_active')
      end
    else
      if page == total_pages
        link(page, page, class: 'boss-paginator__action boss-paginator__action_role_total')
      else
        link(page, page, class: 'boss-paginator__action')
      end
    end
  end

  def link(text, target, attributes = {})
    if target.is_a?(Integer)
      attributes[:rel] = rel_value(target)
      target = url(target)
      attributes[:href] = target
    end

    tag(:a, text, attributes)
  end

  def gap
    text = @template.will_paginate_translate(:page_gap) { '...' }
    %(<a class="boss-paginator__action boss-paginator__action_role_delimiter">#{text}</a>)
  end

  def previous_or_next_page(page, text, classname)
    classes = ['boss-paginator__action']

    if classname == 'previous_page'
      text = 'Previous'
      direction_class = 'boss-paginator__action_role_prev'
    else
      text = 'Next'
      direction_class = 'boss-paginator__action_role_next'
    end

    classes.push(direction_class)

    if page
      link(text, page, class: classes.join(' '))
    else
      classes.push('boss-paginator__action_state_disabled')

      link(text, page, class: classes.join(' '))
    end
  end

  def html_container(html)
    tag(:nav, html, class: 'boss-paginator boss-paginator_position_last')
  end
end
