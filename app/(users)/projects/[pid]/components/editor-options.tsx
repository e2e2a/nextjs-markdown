'use client';

import * as React from 'react';
import { BookOpen, Check, CodeXml, EllipsisVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { EditorState, EditorView } from '@uiw/react-codemirror';
import { sourceModeField, toggleSourceMode } from '@/features/editor/plugins';
import { editableCompartment } from './MarkdownSection';

export function EditorOptions({ editorViewRef }: { editorViewRef: React.RefObject<EditorView | null> }) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string[]>([]);

  const toggleSource = (view: EditorView) => {
    const current = view.state.field(sourceModeField);

    view.dispatch({
      effects: toggleSourceMode.of(!current),
    });
  };

  const toggleViewMode = (view: EditorView) => {
    const isCurrentlyReadOnly = view.state.facet(EditorState.readOnly);
    const nextState = !isCurrentlyReadOnly;
    view.dispatch({
      effects: editableCompartment.reconfigure(EditorState.readOnly.of(nextState)),
    });

    if (nextState) {
      view.scrollDOM.classList.add('cm-readonly');
      view.contentDOM.blur();
    } else {
      view.scrollDOM.classList.remove('cm-readonly');
      view.focus();
    }
  };
  return (
    <div className="flex gap-2 items-center">
      <Button
        variant="ghost"
        onClick={() => {
          const view = editorViewRef.current;
          if (!view) return;
          toggleViewMode(view);
        }}
        tabIndex={-1}
        className="w-8 h-8 flex-wrap gap-1 flex items-center text-foreground"
      >
        <BookOpen className="ml-auto w-6! h-6! opacity-50" />
      </Button>
      <DropdownMenu modal={true} open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger tabIndex={-1} asChild>
          <Button variant="ghost" className="w-8 h-8 flex-wrap gap-1 flex items-center text-foreground">
            <EllipsisVertical className="ml-auto w-6! h-6! opacity-50" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  onSelect={() => {
                    const view = editorViewRef.current;
                    if (!view) return;
                    toggleViewMode(view);
                    setSelected(prev => (prev.includes('Reading View') ? prev.filter(i => i !== 'Reading View') : [...prev, 'Reading View']));
                    setOpen(false);
                  }}
                  className="flex justify-between items-center bg-transparent! cursor-pointer"
                >
                  <div className="flex ">
                    <BookOpen className="mr-2 h-5! w-5!" />
                    <span>Reading View</span>
                  </div>
                  <Check className={cn('h-5! w-5!', selected.includes('Reading View') ? 'opacity-100' : 'opacity-0')} />
                </CommandItem>
                <CommandItem
                  onSelect={() => {
                    const view = editorViewRef.current;
                    if (!view) return;
                    toggleSource(view);
                    setSelected(prev => (prev.includes('Source Mode') ? prev.filter(i => i !== 'Source Mode') : [...prev, 'Source Mode']));
                    setOpen(false);
                  }}
                  className="flex justify-between items-center bg-transparent! cursor-pointer"
                >
                  <div className="flex ">
                    <CodeXml className="mr-2 h-5! w-5!" />
                    <span>Source Mode</span>
                  </div>
                  <Check className={cn('h-5! w-5!', selected.includes('Source Mode') ? 'opacity-100' : 'opacity-0')} />
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
