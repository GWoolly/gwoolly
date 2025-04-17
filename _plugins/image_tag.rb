# _plugins/image_tag.rb
module Jekyll
  class ImageTag < Liquid::Tag
    def initialize(tag_name, text, tokens)
      super
      if text.strip =~ /(.+)\|(\d+)x(\d+)/
        @path = Regexp.last_match(1).strip
        @width = Regexp.last_match(2)
        @height = Regexp.last_match(3)
      else
        @path = text.strip
        @width = nil
        @height = nil
      end
    end

def render(context)
  width_attr = @width ? " width=\"#{@width}\"" : ""
  height_attr = @height ? " height=\"#{@height}\"" : ""
  "<img src=\"/#{@path}\"#{width_attr}#{height_attr} alt=\"Image\" class=\"full-width\" />"
end
  end
end

Liquid::Template.register_tag('image', Jekyll::ImageTag)
