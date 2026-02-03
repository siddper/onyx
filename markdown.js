/**
 * Lightweight markdown-to-HTML parser for the side panel.
 * Handles common markdown: headers, bold, italic, code, blocks, links, lists, blockquotes.
 */
(function (global) {
  function escapeHtml(s) {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };
    return String(s).replace(/[&<>"]/g, (c) => map[c]);
  }

  function parseInline(text) {
    const safe = escapeHtml(text);
    return safe
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/__(.+?)__/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/_(.+?)_/g, "<em>$1</em>")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  }

  function parseBlock(line, nextLines, output) {
    const trimmed = line.trim();
    if (!trimmed) {
      output.push("");
      return 0;
    }

    let match;

    // ATX headers (# ## ### ...)
    if ((match = trimmed.match(/^(#{1,6})\s+(.+)$/))) {
      const level = match[1].length;
      output.push(`<h${level}>${parseInline(match[2].trim())}</h${level}>`);
      return 0;
    }

    // Fenced code block ```
    if (trimmed.startsWith("```")) {
      const lang = trimmed.slice(3).trim() || "";
      const codeLines = [];
      let i = 0;
      while (i < nextLines.length) {
        if (nextLines[i].trim().startsWith("```")) {
          i++;
          break;
        }
        codeLines.push(escapeHtml(nextLines[i]));
        i++;
      }
      output.push(`<pre><code class="language-${escapeHtml(lang)}">${codeLines.join("\n")}</code></pre>`);
      return i;
    }

    // Unordered list
    if ((match = trimmed.match(/^[-*+]\s+(.+)$/))) {
      const items = [parseInline(match[1])];
      let j = 0;
      while (j < nextLines.length && /^\s*[-*+]\s+.+/.test(nextLines[j])) {
        items.push(parseInline(nextLines[j].replace(/^\s*[-*+]\s+/, "")));
        j++;
      }
      output.push("<ul>" + items.map((item) => `<li>${item}</li>`).join("") + "</ul>");
      return j;
    }

    // Ordered list
    if ((match = trimmed.match(/^\d+\.\s+(.+)$/))) {
      const items = [parseInline(match[1])];
      let j = 0;
      while (j < nextLines.length && /^\s*\d+\.\s+.+/.test(nextLines[j])) {
        items.push(parseInline(nextLines[j].replace(/^\s*\d+\.\s+/, "")));
        j++;
      }
      output.push("<ol>" + items.map((item) => `<li>${item}</li>`).join("") + "</ol>");
      return j;
    }

    // Blockquote
    if (trimmed.startsWith(">")) {
      const quoteLines = [trimmed.replace(/^>\s?/, "")];
      let j = 0;
      while (j < nextLines.length && nextLines[j].trim().startsWith(">")) {
        quoteLines.push(nextLines[j].replace(/^>\s?/, ""));
        j++;
      }
      output.push("<blockquote><p>" + quoteLines.map((l) => parseInline(l)).join("</p><p>") + "</p></blockquote>");
      return j;
    }

    // Horizontal rule
    if (/^[-*_]\s{0,2}[-*_]\s{0,2}[-*_](\s*[-*_])*$/.test(trimmed)) {
      output.push("<hr>");
      return 0;
    }

    // Paragraph
    output.push("<p>" + parseInline(trimmed) + "</p>");
    return 0;
  }

  function parse(md) {
    if (!md || typeof md !== "string") return "";
    const lines = md.split("\n");
    const output = [];
    let i = 0;
    while (i < lines.length) {
      const consumed = parseBlock(lines[i], lines.slice(i + 1), output);
      i += 1 + (consumed > 0 ? consumed : 0);
    }
    return output.filter(Boolean).join("\n");
  }

  global.renderMarkdown = parse;
})(typeof window !== "undefined" ? window : this);
