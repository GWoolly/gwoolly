module Jekyll
  class ButtonTag < Liquid::Tag
    def initialize(tag_name, input, tokens)
      super
      @input = input
    end

    def render(context)
      # Parse input
      parts = @input.strip.split(' ', 2)
      url = parts[0].strip
      text = parts.size > 1 ? parts[1].strip : url
      
      # Access site data
      site = context.registers[:site]
      icons = site.data['icons'] || {}
      
      # Default icon values
      icon_img = "link.svg"
      icon_name = "Link"
      icon_class = ""
      
      # Auto-detect icon from URL
      icons.each do |key, value|
        if url.include?(key)
          icon_img = value
          icon_name = key.capitalize
          icon_class = key.downcase
          break
        end
      end
      
      # Generate HTML
      base_url = site.config['baseurl'] || ""
      <<-HTML
      <a href="#{url}" target="_blank" rel="noopener noreferrer" class="site-button #{icon_class}">
        <img src="#{base_url}/img/icons/#{icon_img}" alt="#{icon_name}" class="button-icon">
        <span class="button-text">#{text}</span>
      </a>
      HTML
    end
  end
end

Liquid::Template.register_tag('button', Jekyll::ButtonTag)