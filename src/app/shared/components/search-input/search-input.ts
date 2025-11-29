import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search-input',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './search-input.html',
  styleUrl: './search-input.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchInput),
      multi: true
    }
  ]
})
export class SearchInput implements OnInit, ControlValueAccessor {
  @Input() placeholder = 'Buscar...';
  @Input() debounceTime = 500;
  @Input() disabled = false;

  @Output() search = new EventEmitter<string>();

  searchControl = new FormControl('');
  isFocused = false;

  private onChange = (value: string) => {};
  private onTouched = () => {};

  ngOnInit() {
    this.setupSearch();
  }

  private setupSearch() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(this.debounceTime),
        distinctUntilChanged(),
      )
      .subscribe(value => {
        const searchValue = value || '';
        this.search.emit(searchValue);
        this.onChange(searchValue);
      });
  }

  onFocus() {
    this.isFocused = true;
  }

  onBlur() {
    this.isFocused = false;
    this.onTouched();
  }

  get hasValue(): boolean {
    return !!this.searchControl.value?.trim();
  }

  writeValue(value: string): void {
    this.searchControl.setValue(value || '', { emitEvent: false });
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) {
      this.searchControl.disable();
    } else {
      this.searchControl.enable();
    }
  }
}
