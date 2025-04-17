
import { Plugin } from 'obsidian';

export default class CustomImageRenderer extends Plugin {
    onload() {
        console.log("Custom Image Renderer Plugin Loaded!");

        // Hook into the markdown renderer
        this.registerMarkdownPostProcessor((element, context) => {
            // Find all custom image syntax: ![[path|widthxheight|align|class|caption]]
            const images = element.querySelectorAll('p');
            images.forEach((imageElement) => {
                const text = imageElement.textContent.trim();

                // Regex to capture the parts
                const regex = /!\[\[(.*?)\]\]/;
                const match = regex.exec(text);

                if (match) {
                    const parts = match[1].split('|').map(p => p.trim());
                    const path = parts[0];
                    let width = null, height = null, align = null, cls = "", caption = "";

                    parts.slice(1).forEach(p => {
                        if (/^\d+x\d+$/.test(p)) [width, height] = p.split('x');
                        else if (["left", "right", "center"].includes(p)) align = p;
                        else if (p.startsWith("class=")) cls = p.slice(6);
                        else if (p.startsWith("caption=")) caption = p.slice(8);
                    });

                    const style = {
                        left: 'float:left; margin:0 1em 1em 0;',
                        right: 'float:right; margin:0 0 1em 1em;',
                        center: 'display:block; margin:0 auto;',
                    }[align] || '';

                    const img = `<img src="${path}" ${width ? `width="${width}"` : ''} ${height ? `height="${height}"` : ''} alt="${caption || 'Image'}" class="${cls}" style="${style}">`;

                    const html = caption ? `<figure style="text-align:${align || 'inherit'};">${img}<figcaption>${caption}</figcaption></figure>` : img;

                    imageElement.innerHTML = html;
                }
            });
        });
    }

    onunload() {
        console.log("Custom Image Renderer Plugin Unloaded");
    }
}
