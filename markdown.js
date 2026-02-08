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
      .replace(/~~(.+?)~~/g, "<del>$1</del>")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\[\[([^\]|]+)(?:\|([^\]]*))?\]\]/g, function (_, page, label) {
        var display = (label && label.trim()) ? label.trim() : page;
        return '<span class="markdown-wikilink" title="' + escapeHtml(page) + '">' + escapeHtml(display) + '</span>';
      })
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  }

  function buildListTree(items) {
    const root = { indent: -1, children: [] };
    const stack = [root];
    for (const item of items) {
      while (stack.length > 1 && stack[stack.length - 1].indent >= item.indent) stack.pop();
      const node = { indent: item.indent, content: item.content, children: [] };
      stack[stack.length - 1].children.push(node);
      stack.push(node);
    }
    return root.children;
  }

  function renderListTree(items, openTag, closeTag, renderItemContent) {
    const tree = buildListTree(items);
    function renderNode(node) {
      const nested =
        node.children.length > 0
          ? openTag + node.children.map(renderNode).join("") + closeTag
          : "";
      return "<li>" + renderItemContent(node) + nested + "</li>";
    }
    return openTag + tree.map(renderNode).join("") + closeTag;
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

    // Unordered list (with nesting by indentation)
    if ((match = trimmed.match(/^[-*+]\s+(.+)$/))) {
      const getIndent = (raw) => (raw.match(/^[\s]*/)[0].replace(/\t/g, "    ").length);
      const items = [{ indent: getIndent(line), content: match[1] }];
      let j = 0;
      while (j < nextLines.length && /^\s*[-*+]\s+.+/.test(nextLines[j])) {
        const raw = nextLines[j];
        const bulletMatch = raw.match(/^(\s*)[-*+]\s+(.+)$/);
        if (bulletMatch) items.push({ indent: getIndent(raw), content: bulletMatch[2] });
        j++;
      }
      output.push(renderListTree(items, "<ul>", "</ul>", (item) => parseInline(item.content)));
      return j;
    }

    // Ordered list (with nesting by indentation)
    if ((match = trimmed.match(/^\d+\.\s+(.+)$/))) {
      const getIndent = (raw) => (raw.match(/^[\s]*/)[0].replace(/\t/g, "    ").length);
      const items = [{ indent: getIndent(line), content: match[1] }];
      let j = 0;
      while (j < nextLines.length && /^\s*\d+\.\s+.+/.test(nextLines[j])) {
        const raw = nextLines[j];
        const bulletMatch = raw.match(/^(\s*)\d+\.\s+(.+)$/);
        if (bulletMatch) items.push({ indent: getIndent(raw), content: bulletMatch[2] });
        j++;
      }
      output.push(renderListTree(items, "<ol>", "</ol>", (item) => parseInline(item.content)));
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

    // Table (| col1 | col2 |)
    if (trimmed.startsWith("|") && trimmed.includes("|", 1)) {
      const rows = [];
      let j = 0;
      while (j < nextLines.length && nextLines[j].trim().startsWith("|") && nextLines[j].trim().includes("|", 1)) {
        rows.push(nextLines[j].trim());
        j++;
      }
      const allRows = [trimmed, ...rows];
      const parseCells = (row) => {
        const parts = row.split("|").map((s) => s.trim());
        if (parts[0] === "") parts.shift();
        if (parts[parts.length - 1] === "") parts.pop();
        return parts;
      };
      const isSeparator = (cells) =>
        cells.length > 0 && cells.every((c) => /^:?-+:?$/.test(c));
      const headerCells = parseCells(allRows[0]);
      let headerRow = null;
      let bodyRows = allRows;
      if (allRows.length >= 2 && isSeparator(parseCells(allRows[1]))) {
        headerRow = headerCells;
        bodyRows = allRows.slice(2);
      } else {
        bodyRows = allRows;
      }
      let html = "<table><tbody>";
      if (headerRow) {
        html =
          "<table><thead><tr>" +
          headerRow.map((c) => "<th>" + parseInline(c) + "</th>").join("") +
          "</tr></thead><tbody>";
      }
      for (const row of bodyRows) {
        const cells = parseCells(row);
        if (cells.length === 0) continue;
        html += "<tr>" + cells.map((c) => "<td>" + parseInline(c) + "</td>").join("") + "</tr>";
      }
      html += "</tbody></table>";
      output.push(html);
      return j;
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
