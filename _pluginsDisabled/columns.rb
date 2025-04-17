module Jekyll
  class StartColumnTag < Liquid::Tag
    def initialize(tag_name, class_name, tokens)
      super
      @class_name = class_name.strip
    end

    def render(context)
      class_attr = @class_name.empty? ? '' : " #{@class_name}"
      "<div class=\"flex-container\"><div class=\"flex-column#{class_attr}\">"
    end
  end

  class ColumnTag < Liquid::Tag
    def initialize(tag_name, class_name, tokens)
      super
      @class_name = class_name.strip
    end

    def render(context)
      class_attr = @class_name.empty? ? '' : " #{@class_name}"
      "</div><div class=\"flex-column#{class_attr}\">"
    end
  end

  class EndColumnTag < Liquid::Tag
    def render(context)
      "</div></div>"
    end
  end
end

Liquid::Template.register_tag('startcolumn', Jekyll::StartColumnTag)
Liquid::Template.register_tag('column', Jekyll::ColumnTag)
Liquid::Template.register_tag('endcolumn', Jekyll::EndColumnTag)
