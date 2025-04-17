module Jekyll
  class ColumnsBlock < Liquid::Block
    def initialize(tag_name, markup, tokens)
      @markup = markup
      @classes = markup.strip.split(' ')
      super
    end

    def render(context)
      content = super
      columns = content.split('<!-- column -->')
      
      output = "<div class='flex-container'>"
      columns.each_with_index do |column, index|
        class_name = @classes[index] || ''
        output += "<div class='flex-column #{class_name}'>#{column}</div>"
      end
      output += "</div>"
      
      output
    end
  end
end

Liquid::Template.register_tag('columns', Jekyll::ColumnsBlock)