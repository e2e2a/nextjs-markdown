import { EditorView, WidgetType } from '@uiw/react-codemirror';
import mermaid from 'mermaid';

// mermaid.initialize({ startOnLoad: false, theme: 'dark' });
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  flowchart: {
    useMaxWidth: false,
    htmlLabels: true,
    curve: 'basis',
    nodeSpacing: 50,
    rankSpacing: 50,
  },
  sequence: { useMaxWidth: false },
  gantt: { useMaxWidth: false },
});
export class MermaidWidget extends WidgetType {
  constructor(
    readonly code: string,
    readonly pos: number
  ) {
    super();
  }

  toDOM(view: EditorView) {
    const container = document.createElement('div');
    container.className =
      'group border border-transparent hover:border-border transition-colors relative block w-full max-w-full box-border z-10 select-none leading-[0] overflow-x-auto! overflow-y-hidden!';

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

    const scrollWrapper = document.createElement('div');
    scrollWrapper.className = 'mermaid-scroll-wrapper';

    const renderArea = document.createElement('div');
    renderArea.className = 'mermaid-render-area';
    const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;
    renderArea.id = id;

    container.appendChild(btn);
    scrollWrapper.appendChild(renderArea);
    container.appendChild(scrollWrapper);

    requestAnimationFrame(async () => {
      try {
        const isValid = await mermaid.parse(this.code, { suppressErrors: true });
        if (!isValid) throw new Error('Syntax Error');

        const { svg } = await mermaid.render(`${id}-svg`, this.code);
        renderArea.innerHTML = svg;

        const svgElement = renderArea.querySelector('svg');
        if (svgElement) {
          svgElement.style.maxWidth = 'none';
          svgElement.style.width = 'auto';
          svgElement.setAttribute('height', 'auto');
        }
      } catch {
        renderArea.innerHTML = `<div style="line-height: normal; color: #ef4444; font-size: 12px; padding: 10px;">Syntax Error</div>`;
      }
    });

    return container;
  }
  eq(other: MermaidWidget) {
    return other.code === this.code;
  }
}
