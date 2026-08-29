import { Component, Output, EventEmitter, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { neckConfig, SCALE_PATTERNS, CHORD_PATTERNS } from 'guitar-neck-shared';
import { FretboardCommand, MusicKey, ShowKind, ToolboxIntent, Interval } from './model';
import { PREDEFINED_PATTERNS, PredefinedPattern } from '../../../shared/interval-utils';

export type OpenDropdownId = 'intent' | 'showKind' | 'key' | 'scaleType' | 'chordType' | 'pattern' | 'compareScaleKey' | 'compareScaleType' | 'compareChordKey' | 'compareChordType' | null;

@Component({
  selector: 'app-toolbox-builder',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toolbox.builder.component.html',
  styleUrl: './toolbox.builder.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolboxBuilderComponent {
  @Output() toolboxEvent: EventEmitter<FretboardCommand> = new EventEmitter<FretboardCommand>();

  // --- Data sources ---
  musicKeys = neckConfig.chromaticNotes as MusicKey[];
  scalePatternNames = SCALE_PATTERNS.map(s => s.name);
  chordPatternNames = CHORD_PATTERNS.map(c => c.name);
  predefinedPatterns = PREDEFINED_PATTERNS;

  // --- State signals ---
  intent = signal<ToolboxIntent>('show');
  showKind = signal<ShowKind>('scale');

  // Show state
  selectedKey = signal<MusicKey>('C');
  selectedScaleType = signal<string>(this.scalePatternNames[0]);
  selectedChordType = signal<string>(this.chordPatternNames[0]);
  selectedPattern = signal<PredefinedPattern>(this.predefinedPatterns[0]);

  // Compare state
  compareScaleKey = signal<MusicKey>('C');
  compareScaleType = signal<string>(this.scalePatternNames[0]);
  compareChordKey = signal<MusicKey>('C');
  compareChordType = signal<string>(this.chordPatternNames[0]);

  // --- Dropdown state ---
  openDropdown = signal<OpenDropdownId>(null);
  filterText = signal('');

  // --- Computed: filtered options for each dropdown ---
  filteredKeys = computed(() =>
    this.musicKeys.filter(k =>
      k.toLowerCase().includes(this.filterText().toLowerCase())
    )
  );

  filteredScaleTypes = computed(() =>
    this.scalePatternNames.filter(s =>
      s.toLowerCase().includes(this.filterText().toLowerCase())
    )
  );

  filteredChordTypes = computed(() =>
    this.chordPatternNames.filter(c =>
      c.toLowerCase().includes(this.filterText().toLowerCase())
    )
  );

  filteredPatterns = computed(() =>
    this.predefinedPatterns.filter(p =>
      p.label.toLowerCase().includes(this.filterText().toLowerCase())
    )
  );

  // --- Sentence text (for display) ---
  showSentence = computed(() => {
    const kind = this.showKind();
    switch (kind) {
      case 'scale':
        return `Show scale ${this.selectedKey()} ${this.selectedScaleType()} on fretboard`;
      case 'chord':
        return `Show chord ${this.selectedKey()} ${this.selectedChordType()} on fretboard`;
      case 'intervalPattern':
        return `Show interval pattern ${this.selectedPattern().label} in ${this.selectedKey()} on fretboard`;
    }
  });

  compareSentence = computed(() =>
    `Compare scale ${this.compareScaleKey()} ${this.compareScaleType()} with chord ${this.compareChordKey()} ${this.compareChordType()}`
  );

  // --- Dropdown helpers ---
  toggleDropdown(id: OpenDropdownId): void {
    if (this.openDropdown() === id) {
      this.openDropdown.set(null);
      this.filterText.set('');
    } else {
      this.openDropdown.set(id);
      this.filterText.set('');
    }
  }

  closeDropdown(): void {
    this.openDropdown.set(null);
    this.filterText.set('');
  }

  onFilterInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filterText.set(input.value);
  }

  // --- Selection handlers ---
  selectKey(key: MusicKey): void {
    this.selectedKey.set(key);
    this.closeDropdown();
  }

  selectScaleType(type: string): void {
    this.selectedScaleType.set(type);
    this.closeDropdown();
  }

  selectChordType(type: string): void {
    this.selectedChordType.set(type);
    this.closeDropdown();
  }

  selectPattern(pattern: PredefinedPattern): void {
    this.selectedPattern.set(pattern);
    this.closeDropdown();
  }

  selectCompareScaleKey(key: MusicKey): void {
    this.compareScaleKey.set(key);
    this.closeDropdown();
  }

  selectCompareScaleType(type: string): void {
    this.compareScaleType.set(type);
    this.closeDropdown();
  }

  selectCompareChordKey(key: MusicKey): void {
    this.compareChordKey.set(key);
    this.closeDropdown();
  }

  selectCompareChordType(type: string): void {
    this.compareChordType.set(type);
    this.closeDropdown();
  }

  // --- Template helpers (Angular templates can't use TypeScript casts or multiple statements) ---
  setShowKind(kind: string): void {
    this.showKind.set(kind as ShowKind);
    this.closeDropdown();
  }

  setIntent(intent: string): void {
    this.intent.set(intent as ToolboxIntent);
    this.closeDropdown();
  }

  // --- Submit ---
  submit(): void {
    if (this.intent() === 'show') {
      const kind = this.showKind();
      const key = this.selectedKey();

      let command: FretboardCommand;
      switch (kind) {
        case 'scale':
          command = { kind: 'scale', key, scaleType: this.selectedScaleType() };
          break;
        case 'chord':
          command = { kind: 'chord', key, chordType: this.selectedChordType() };
          break;
        case 'intervalPattern':
          command = { kind: 'intervalPattern', key, intervals: this.selectedPattern().intervals };
          break;
      }
      this.toolboxEvent.emit(command);
    } else {
      const command: FretboardCommand = {
        kind: 'scaleChordRelation',
        scaleKey: this.compareScaleKey(),
        scaleType: this.compareScaleType(),
        chordKey: this.compareChordKey(),
        chordType: this.compareChordType(),
      };
      this.toolboxEvent.emit(command);
    }
  }
}