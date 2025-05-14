module Jekyll
  # Plugin to transform markdown links into styled buttons with icons
  class LinkToButtonConverter < Jekyll::Generator
    safe true
    priority :low  # Run after other converters

    def generate(site)
      # Load icon definitions
      @icons = site.data['icons'] || {}
      @base_url = site.config['baseurl'] || ""

      # Process all markdown pages and posts
      site.pages.each { |page| process(page) if processable?(page) }
      site.posts.docs.each { |post| process(post) if processable?(post) }
    end

    def processable?(item)
      # Only process markdown files
      return false if item.extname != '.md' && item.data['ext'] != '.md'
      return false if item.data['no_link_to_button'] == true  # Allow opting out
      true
    end

    def process(item)
      # Regular expression to find markdown links [text](url)
      # Captures group 1: Link text
      # Captures group 2: URL
      link_regex = /\[([^\]]*)\]\(([^\)]+)\)/

      # Skip processing if content is nil
      return if item.content.nil?

      # Replace markdown links with buttons
      item.content = item.content.gsub(link_regex) do |match|
        text = $1
        url = $2

        # Check if this URL matches any of our icon patterns
        icon_found = false
        icon_img = "link.svg"  # Default
        icon_name = "Link"
        icon_class = ""

        @icons.each do |key, value|
          if url.include?(key)
            icon_img = value
            icon_name = key.capitalize
            icon_class = key.downcase
            icon_found = true
            break
          end
        end

        # Special case: empty text or just "_" means icon-only button
        icon_only = text.empty? || text == "_"
        
        # If it's a recognized platform but not icon-only, use the button style
        if icon_found
          button_html = "<a href=\"#{url}\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"site-button #{icon_class}\">" +
                        "<img src=\"#{@base_url}/img/icons/#{icon_img}\" alt=\"#{icon_name}\" class=\"button-icon\">"
          
          # Add text span only if not icon-only mode
          button_html += "<span class=\"button-text\">#{text}</span>" unless icon_only
          
          button_html += "</a>"
        else
          # Not a recognized platform, keep as normal link
          button_html = "<a href=\"#{url}\" target=\"_blank\" rel=\"noopener noreferrer\">#{text}</a>"
        end
        
        button_html
      end
    end
  end
end