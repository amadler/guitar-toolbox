import { of, throwError } from 'rxjs';
import { DisplayAllNotesCommand, DisplayChordCommand, DisplayCustomPatternCommand, DisplayScaleCommand, DisplaySingleNoteCommand, NoteSelector } from './UICommands';

describe('UICommands', () => {
  let mockNoteSelector: jasmine.SpyObj<NoteSelector>;

  beforeEach(() => {
    mockNoteSelector = jasmine.createSpyObj('NoteSelector', [
      'selectChord',
      'selectScale',
      'selectNote',
      'selectAllNotes',
      'selectNotes'
    ]);
  });

  describe('DisplaySingleNoteCommand', () => {
    it('should call selectNote with the given key', () => {
      const command = new DisplaySingleNoteCommand(mockNoteSelector, 'A');
      command.execute();

      expect(mockNoteSelector.selectNote).toHaveBeenCalledWith('A');
    });
  });

  describe('DisplayAllNotesCommand', () => {
    it('should call selectAllNotes', () => {
      const command = new DisplayAllNotesCommand(mockNoteSelector);
      command.execute();

      expect(mockNoteSelector.selectAllNotes).toHaveBeenCalled();
    });
  });

  describe('DisplayScaleCommand', () => {
    it('should call selectScale and log notes on success', () => {
      mockNoteSelector.selectScale.and.returnValue(of(['C', 'D', 'E', 'F', 'G', 'A', 'B']));
      spyOn(console, 'log');

      const command = new DisplayScaleCommand(mockNoteSelector, 'Major', 'C');
      command.execute();

      expect(mockNoteSelector.selectScale).toHaveBeenCalledWith('Major', 'C');
      expect(console.log).toHaveBeenCalledWith('Scale displayed:', ['C', 'D', 'E', 'F', 'G', 'A', 'B']);
    });

    it('should log error when selectScale fails', () => {
      mockNoteSelector.selectScale.and.returnValue(throwError(() => new Error('API error')));
      spyOn(console, 'error');

      const command = new DisplayScaleCommand(mockNoteSelector, 'Invalid', 'C');
      command.execute();

      expect(mockNoteSelector.selectScale).toHaveBeenCalledWith('Invalid', 'C');
      expect(console.error).toHaveBeenCalledWith('Error displaying scale:', jasmine.any(Error));
    });
  });

  describe('DisplayChordCommand', () => {
    it('should call selectChord and log notes on success', () => {
      mockNoteSelector.selectChord.and.returnValue(of(['C', 'E', 'G']));
      spyOn(console, 'log');

      const command = new DisplayChordCommand(mockNoteSelector, 'Major Triad', 'C');
      command.execute();

      expect(mockNoteSelector.selectChord).toHaveBeenCalledWith('Major Triad', 'C');
      expect(console.log).toHaveBeenCalledWith('Chord displayed:', ['C', 'E', 'G']);
    });

    it('should log error when selectChord fails', () => {
      mockNoteSelector.selectChord.and.returnValue(throwError(() => new Error('Not found')));
      spyOn(console, 'error');

      const command = new DisplayChordCommand(mockNoteSelector, 'Invalid', 'C');
      command.execute();

      expect(mockNoteSelector.selectChord).toHaveBeenCalledWith('Invalid', 'C');
      expect(console.error).toHaveBeenCalledWith('Error displaying chord:', jasmine.any(Error));
    });
  });

  describe('DisplayCustomPatternCommand', () => {
    it('should calculate notes from intervals and call selectNotes', () => {
      mockNoteSelector.selectNotes.and.returnValue(of(['C', 'E', 'G']));

      const command = new DisplayCustomPatternCommand(mockNoteSelector, [4, 3], 'C');
      command.execute();

      expect(mockNoteSelector.selectNotes).toHaveBeenCalledWith(['C', 'E', 'G'], 'C');
    });

    it('should wrap around the chromatic scale', () => {
      mockNoteSelector.selectNotes.and.returnValue(of([]));

      const command = new DisplayCustomPatternCommand(mockNoteSelector, [11], 'C');
      command.execute();

      expect(mockNoteSelector.selectNotes).toHaveBeenCalledWith(['C', 'B'], 'C');
    });
  });
});
