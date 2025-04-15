module Jekyll
  class ColumnsBlock < Liquid::Block
    def initialize(tag_name, markup, tokens)
      super
      @markup = markup
    end

    def render(context)
      content = super
      site = context.registers[:site]
      converter = site.find_converter_instance(::Jekyll::Converters::Markdown)
      
      # Extract the column blocks
      column_blocks = content.scan(/\{% column %}(.*?)\{% endcolumn %}/m).flatten
      
      # Start building the output HTML
      output = "<div class=\"multi-column#{@markup.strip}\">\n"
      
      # Process each column
      column_blocks.each do |column_content|
        # Convert the column's Markdown content to HTML
        column_html = converter.convert(column_content.strip)
        output += "  <div>#{column_html}</div>\n"
      end
      
      output += "</div>"
      output
    end
  end
end

Liquid::Template.register_tag('columns', Jekyll::ColumnsBlock)

module Jekyll
  class ColumnBlock < Liquid::Block
    def render(context)
      "{% column %}" + super + "{% endcolumn %}"
    end
  end
end

Liquid::Template.register_tag('column', Jekyll::ColumnBlock)