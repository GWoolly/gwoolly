# columns_container_tag.rb
module Jekyll
  class ColumnsContainerBlock < Liquid::Block
    def initialize(tag_name, markup, tokens)
      super
    end
    def render(context)
      content = super

      # Wrap all columns in a flex container
      "<div class=\"flex-container\">#{content}</div>"
    end
  end
end
Liquid::Template.register_tag('columns', Jekyll::ColumnsContainerBlock)