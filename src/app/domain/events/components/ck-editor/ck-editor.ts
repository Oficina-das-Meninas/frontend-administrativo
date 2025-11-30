import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnInit, Output, signal, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import {
  Alignment,
  Autoformat,
  AutoLink,
  Autosave,
  BlockQuote,
  BlockToolbar,
  Bold,
  ClassicEditor,
  Code,
  CodeBlock,
  Essentials,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  Heading,
  HorizontalLine,
  Indent,
  IndentBlock,
  Italic,
  Link,
  List,
  Paragraph,
  PasteFromMarkdownExperimental,
  Strikethrough,
  Table,
  TableToolbar,
  Underline,
  WordCount,
  type EditorConfig,
} from 'ckeditor5';
import translations from 'ckeditor5/translations/pt-br.js';

const LICENSE_KEY = 'GPL';

@Component({
  selector: 'app-ck-editor',
  imports: [CKEditorModule, CommonModule],
  templateUrl: './ck-editor.html',
  styleUrl: './ck-editor.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CKEditorComponent),
      multi: true,
    },
  ],
})
export class CKEditorComponent implements OnInit, AfterViewInit, ControlValueAccessor {
  @Input() initialData: string = '';
  @Input() maxLength: number = 5000;
  @Output() dataChange = new EventEmitter<string>();

  public isLayoutReady = false;
  public Editor = ClassicEditor;
  public config: EditorConfig = {};
  public editorData: string = '';
  private editor: any = null;
  private isInitializingFromParent = false;
  public charactersCount = signal<number>(0);
  public isExceedingLimit = signal<boolean>(false);

  private onChangeCallback: ((value: string) => void) | null = null;
  private onTouched: (() => void) | null = null;

  constructor(private changeDetector: ChangeDetectorRef) {}

  private extractPlainText(html: string): string {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return (temp.textContent || temp.innerText || '').trim();
  }

  ngOnInit(): void {
    this.editorData = this.initialData;
    this.isInitializingFromParent = true;
  }

  ngAfterViewInit(): void {
    this.config = {
      toolbar: {
        items: [
          'undo',
          'redo',
          '|',
          'heading',
          '|',
          'bold',
          'italic',
          'underline',
          '|',
          'alignment',
          '|',
          'blockQuote',
          'codeBlock',
          'horizontalLine',
          'link',
          '|',
          'bulletedList',
          'numberedList',
          'outdent',
          'indent',
          '|',
          'code',
          'insertTable',
          'strikethrough',
          '|',
          'fontSize',
          'fontFamily',
          'fontColor',
          'fontBackgroundColor',
        ],
        shouldNotGroupWhenFull: false,
      },
      plugins: [
        Alignment,
        Autoformat,
        AutoLink,
        Autosave,
        BlockQuote,
        BlockToolbar,
        Bold,
        Code,
        CodeBlock,
        Essentials,
        FontBackgroundColor,
        FontColor,
        FontFamily,
        FontSize,
        Heading,
        HorizontalLine,
        Indent,
        IndentBlock,
        Italic,
        Link,
        List,
        Paragraph,
        PasteFromMarkdownExperimental,
        Strikethrough,
        Table,
        TableToolbar,
        Underline,
        WordCount,
      ],
      initialData: this.editorData,
      fontFamily: {
        supportAllValues: true,
      },
      fontSize: {
        options: [10, 12, 14, 'default', 18, 20, 22],
        supportAllValues: true,
      },
      heading: {
        options: [
          {
            model: 'paragraph',
            title: 'Paragraph',
            class: 'ck-heading_paragraph',
          },
          {
            model: 'heading1',
            view: 'h1',
            title: 'Heading 1',
            class: 'ck-heading_heading1',
          },
          {
            model: 'heading2',
            view: 'h2',
            title: 'Heading 2',
            class: 'ck-heading_heading2',
          },
          {
            model: 'heading3',
            view: 'h3',
            title: 'Heading 3',
            class: 'ck-heading_heading3',
          },
          {
            model: 'heading4',
            view: 'h4',
            title: 'Heading 4',
            class: 'ck-heading_heading4',
          },
          {
            model: 'heading5',
            view: 'h5',
            title: 'Heading 5',
            class: 'ck-heading_heading5',
          },
          {
            model: 'heading6',
            view: 'h6',
            title: 'Heading 6',
            class: 'ck-heading_heading6',
          },
        ],
      },
      language: 'pt-br',
      licenseKey: LICENSE_KEY,
      link: {
        addTargetToExternalLinks: true,
        defaultProtocol: 'https://',
        decorators: {
          toggleDownloadable: {
            mode: 'manual',
            label: 'Downloadable',
            attributes: {
              download: 'file',
            },
          },
        },
      },
      placeholder: 'Escreva a descrição do evento aqui!',
      table: {
        contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
      },
      translations: [translations],
    };

    this.isLayoutReady = true;
    this.changeDetector.detectChanges();
  }

  onEditorReady(editor: any): void {
    this.editor = editor;

    editor.model.document.on('paste', (evt: any, data: any) => {
      const text = data.dataTransfer.getData('text/plain');
      if (text) {
        data.content = editor.model.createText(text);
      }
    });

    const maxLength = this.maxLength;

    this.editor.model.document.on('change:data', () => {
      const data = this.editor.getData();
      const plainText = this.extractPlainText(data);
      const charCount = plainText.length;

      if (charCount > maxLength) {
        const undoCommand = this.editor.commands.get('undo');
        if (undoCommand && undoCommand.isEnabled) {
          this.editor.execute('undo');
          const undoneData = this.editor.getData();
          const undoneText = this.extractPlainText(undoneData);
          this.charactersCount.set(undoneText.length);
          this.isExceedingLimit.set(false);
        }
      }
    });

    if (this.editorData && this.isInitializingFromParent) {
      const plainText = this.extractPlainText(this.editorData);
      this.charactersCount.set(plainText.length);

      editor.setData(this.editorData);
      this.isInitializingFromParent = false;
    } else if (!this.editorData && this.isInitializingFromParent) {
      this.charactersCount.set(0);
      this.isInitializingFromParent = false;
    }
  }

  onEditorChange(event: any): void {
    if (!this.editor) return;

    let data = this.editor.getData();
    const plainText = this.extractPlainText(data);
    const charCount = plainText.length;

    this.charactersCount.set(charCount);
    this.isExceedingLimit.set(charCount > this.maxLength);

    this.editorData = data;
    this.dataChange.emit(data);

    if (this.onChangeCallback) {
      this.onChangeCallback(data);
    }
  }

  writeValue(value: string): void {
    if (value != null && this.editor && value !== this.editorData) {
      this.editorData = value;
      this.editor.setData(value);
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (this.editor) {
      this.editor.isReadOnly = isDisabled;
    }
  }
}
