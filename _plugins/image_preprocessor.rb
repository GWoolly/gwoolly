# # Jekyll::Hooks.register [:pages, :documents], :pre_render do |doc|
  # # next unless doc.output_ext == '.html'

  # # puts "[ImagePreprocessor] Processing: #{doc.relative_path}"

  # # content = doc.content

  # # content.gsub!(/!\[\[(.+?)\]\]/) do
    # # match = Regexp.last_match(1).strip
    # # parts = match.split('|').map(&:strip)

    # # path = parts[0]
    # # options = parts[1..] || []

    # # width = nil
    # # height = nil
    # # align = nil
    # # alt = nil
    # # css_class = nil
    # # caption = nil

    # # options.each do |opt|
      # # case opt
      # # when /^(\d+)x(\d+)$/
        # # width, height = $1, $2
      # # when /\A(left|right|center)\z/
        # # align = opt
      # # when /^alt=(.+)$/i
        # # alt = $1.strip
      # # when /^class=(.+)$/i
        # # css_class = $1.strip
      # # when /^caption=(.+)$/i
        # # caption = $1.strip
      # # end
    # # end

    # # width_attr = width ? " width=\"#{width}\"" : ""
    # # height_attr = height ? " height=\"#{height}\"" : ""
    # # alt_attr = alt ? " alt=\"#{alt}\"" : " alt=\"Image\""
    # # class_attr = css_class ? " class=\"#{css_class}\"" : ""

    # # style_attr = case align
                 # # when "left"
                   # # ' style="float:left; margin: 0 1em 1em 0;"'
                 # # when "right"
                   # # ' style="float:right; margin: 0 0 1em 1em;"'
                 # # when "center"
                   # # ' style="display:block; margin: 0 auto;"'
                 # # else
                   # # ""
                 # # end

    # # img_tag = "<img src=\"/#{path}\"#{width_attr}#{height_attr}#{alt_attr}#{class_attr}#{style_attr} />"

    # # if caption
      # # figure_style = align == "center" ? ' style="text-align:center;"' : ""
      # # "<figure#{figure_style}>#{img_tag}<figcaption>#{caption}</figcaption></figure>"
    # # else
      # # img_tag
    # # end
  # # end

  # # doc.content = content
# # end


Jekyll::Hooks.register [:pages, :documents], :pre_render do |doc|
  next unless doc.output_ext == '.html'

  # Only process documents that have "layout" defined
  # (usually real posts/pages, not things like feed.xml)
  next unless doc.data['layout']

  puts "[ImagePreprocessor] Processing: #{doc.relative_path}"

  content = doc.content.dup

content.gsub!(/!\[\[(.+?)\]\]/) do
  match = Regexp.last_match(1).strip
  parts = match.split('|').map(&:strip)

  path = parts[0]
  options = parts[1..] || []

  width = nil
  height = nil
  align = nil
  alt = nil
  css_class = nil
  caption = nil

  options.each do |opt|
    case opt
    when /^(\d+)x(\d+)$/
      width, height = $1, $2
    when /\A(left|right|center)\z/
      align = opt
    when /^alt=(.+)$/i
      alt = $1.strip
    when /^class=(.+)$/i
      css_class = $1.strip
    when /^caption=(.+)$/i
      caption = $1.strip
    end
  end

  width_attr = width ? " width=\"#{width}\"" : ""
  height_attr = height ? " height=\"#{height}\"" : ""
  alt_attr = alt ? " alt=\"#{alt}\"" : " alt=\"Image\""
  class_attr = css_class ? " class=\"#{css_class}\"" : ""

  style_attr = case align
               when "left"
                 ' style="float:left; margin: 0 1em 1em 0;"'
               when "right"
                 ' style="float:right; margin: 0 0 1em 1em;"'
               when "center"
                 ' style="display:block; margin: 0 auto;"'
               else
                 ""
               end

  # Build the <img> tag
  img_tag = "<img src=\"/#{path}\"#{width_attr}#{height_attr}#{alt_attr}#{style_attr} />"

  # If class is polaroid, wrap the image in a <div class="photo-inner">
  if css_class&.include?("polaroid")
    img_tag = "<div class=\"photo-inner\">#{img_tag}</div>"
  end

  if caption
    figure_style = align == "center" ? ' style="text-align:center;"' : ""
    "<figure#{figure_style}#{class_attr}>#{img_tag}<figcaption>#{caption}</figcaption></figure>"
  else
    img_tag
  end
end


  doc.content = content
end
