import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import "highlight.js/styles/github.css"; // Use GitHub style for code highlighting

const md = new MarkdownIt({
  html: true, // Allow HTML tags
  linkify: true, // Autoconvert URLs to links
  typographer: true, // Enable smart quotes and other typographic replacements
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        const highlighted = hljs.highlight(str, { language: lang }).value;
        return `<pre class="hljs"><div class="pre_copy">复制</div><div class="run_code">运行</div><code>${highlighted}</code></pre>`;
      } catch (__) {}
    }
    return `<pre class="hljs"><div class="pre_copy">复制</div><div class="run_code">运行</div><code>${md.utils.escapeHtml(
      str
    )}</code></pre>`;
  },
});

// Custom rendering for <think> tags
md.renderer.rules.html_block = (tokens, idx, options, env, self) => {
  const token = tokens[idx];
  if (token.content.includes("<think>")) {
    const content = token.content
      .replace(/<think>/g, "")
      .replace(/<\/think>/g, "")
      .trim();
    return `<div class="think-block bg-gray-50 border-l-4 border-blue-500 pl-4 py-2 my-2">${md.render(
      content
    )}</div>`;
  }
  return token.content;
};

// Support for mermaid diagrams
md.use((md) => {
  const defaultRender = md.renderer.rules.fence || (() => "");
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    if (token.info.trim() === "mermaid") {
      return `<div class="mermaid">${token.content}</div>`;
    }
    return defaultRender(tokens, idx, options, env, self);
  };
});

export function renderMarkdown(markdown) {
  try {
    return md.render(markdown || "");
  } catch (error) {
    console.error("Markdown rendering error:", error);
    return "<p>Error rendering markdown content.</p>";
  }
}
