# Render images with tags
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

    # Add data attributes for gallery functionality
    data_attrs = " data-src=\"/#{path}\" data-caption=\"#{caption || ''}\" data-expandable=\"true\""

    # Build the <img> tag
    img_tag = "<img src=\"/#{path}\"#{width_attr}#{height_attr}#{alt_attr}#{style_attr}#{data_attrs} />"

    # If class is polaroid, wrap the image in a <div class="photo-inner">
    if css_class&.include?("polaroid")
      img_tag = "<div class=\"photo-inner\">#{img_tag}</div>"
    end

    if caption
      figure_style = align == "center" ? ' style="text-align:center;"' : ""
      "<figure#{figure_style}#{class_attr}>#{img_tag}<figcaption>#{caption}</figcaption></figure>"
    else
      # Wrap single image in a div with single-image-gallery class for JS to identify
      "<div class=\"single-image-gallery\">#{img_tag}</div>"
    end
  end

  doc.content = content
end

# Portfolio polaroid gallery
Jekyll::Hooks.register [:pages, :documents], :pre_render do |doc|
  next unless doc.output_ext == '.html'
  
  content = doc.content.dup
  
  content.gsub!(/```polaroid\s+(.+?)```/m) do
    gallery_raw = Regexp.last_match(1).strip
    images = gallery_raw.split("\n").map do |line|
      path, caption = line.split('|').map(&:strip)
      <<~HTML
        <figure class="polaroid">
          <img src="#{path}" alt="#{caption || 'Photo'}" />
          <figcaption>#{caption}</figcaption>
        </figure>
      HTML
    end
    "<div class=\"polaroid-stack\">\n#{images.join("\n")}\n</div>"
  end
  
  doc.content = content
end

# Process regular markdown image syntax to make them expandable
Jekyll::Hooks.register [:pages, :documents], :pre_render do |doc|
  next unless doc.output_ext == '.html'
  
  content = doc.content.dup
  
  # Match standard markdown image syntax ![alt](url)
  content.gsub!(/!\[(.*?)\]\(([^)]+)\)/) do
    alt = $1.strip
    url = $2.strip
    # Don't process images that are already being handled by our custom syntax
    next "![#{alt}](#{url})" if url.include?('|')
    
    <<~HTML
    <div class="single-image-gallery">
      <img src="#{url}" alt="#{alt}" data-src="#{url}" data-caption="#{alt}" data-expandable="true" /> 
    </div>
    HTML
  end
  
  doc.content = content
end

# Portfolio gallery with captions
# Gallery with modal view and captions
Jekyll::Hooks.register [:pages, :documents], :pre_render do |doc|
  next unless doc.output_ext == '.html'
  
  content = doc.content.dup
  
  content.gsub!(/```gallery\s+(.+?)```/m) do
    gallery_raw = Regexp.last_match(1).strip
    images = gallery_raw.split("\n").map do |line|
      path, caption = line.split('|').map(&:strip)
      # Store caption in data attribute so we can access it in the modal
      <<~HTML
        <div class="gallery-item" data-src="#{path}" data-caption="#{caption || ''}">
          <img src="#{path}" alt="#{caption || 'Gallery image'}" />
        </div>
      HTML
    end
    
    <<~HTML
<div class="gallery-container" id="gallery">
  #{images.join("\n")}
</div>
    HTML
  end
  
  doc.content = content
end