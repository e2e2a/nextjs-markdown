import { EditorView, WidgetType } from '@uiw/react-codemirror';
import mermaid from 'mermaid';

mermaid.initialize({ startOnLoad: false, theme: 'dark' });

export class MermaidWidget extends WidgetType {
  constructor(
    readonly code: string,
    readonly pos: number
  ) {
    super();
  }

  toDOM(view: EditorView) {
    const container = document.createElement('div');
    container.className = 'mermaid-widget-container group';

    const btn = document.createElement('button');
    btn.className = 'mermaid-toggle-btn';
    btn.innerHTML = `<span>&lt;/&gt;</span>`;
    btn.onclick = e => {
      e.preventDefault();
      e.stopPropagation();
      view.requestMeasure();
      view.dispatch({
        selection: { anchor: this.pos + 4 },
        scrollIntoView: true,
      });
      view.focus();
    };

    const renderArea = document.createElement('div');
    renderArea.className = 'mermaid-render-area';
    const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;
    renderArea.id = id;

    container.appendChild(btn);
    container.appendChild(renderArea);

    requestAnimationFrame(async () => {
      try {
        // v10+ Mermaid render is async
        const { svg } = await mermaid.render(`${id}-svg`, this.code);
        renderArea.innerHTML = svg;
      } catch (e) {
        renderArea.innerHTML = `<div style="line-height: normal; color: #ef4444; font-size: 12px; padding: 10px;">Syntax Error</div>`;
      }
    });

    return container;
  }
  eq(other: MermaidWidget) {
    // If the code is exactly the same, do NOT recreate the widget.
    // This stops the "text-then-diagram" flicker during unrelated edits.
    return other.code === this.code;
  }
}
