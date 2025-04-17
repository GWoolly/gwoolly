# module Jekyll
  # class ColumnTagBlock < Liquid::Block
    # def initialize(tag_name, markup, tokens)
      # super
    # end

    # def render(context)
      # content = super
      # site = context.registers[:site]
      # converter = site.find_converter_instance(Jekyll::Converters::Markdown)
      
      # # Process the markdown content
      # converted_content = converter.convert(content)
      
      # # Wrap in a flex column div
      # "<div class=\"flex-column\">#{converted_content}</div>"
    # end
  # end
# end

# Liquid::Template.register_tag('column', Jekyll::ColumnTagBlock)

# column_tag.rb
module Jekyll
  class ColumnTagBlock < Liquid::Block
    def initialize(tag_name, markup, tokens)
      super
      @markup = markup
    end

    def render(context)
      content = super
      site = context.registers[:site]
      converter = site.find_converter_instance(Jekyll::Converters::Markdown)
      
      # Process the markdown content but preserve HTML
      converted_content = converter.convert(content)
      
      # Add any additional markup/classes from the tag if provided
      markup_attr = @markup.strip.empty? ? "" : " #{@markup}"
      
      # Wrap in a flex column div
      "<div class=\"flex-column\"#{markup_attr}>#{converted_content}</div>"
    end
  end
end

Liquid::Template.register_tag('column', Jekyll::ColumnTagBlock)