'use client';

import React from 'react';
import { AutosaveIndicatorProvider } from '@/context/AutosaveIndicator';
import { useToast } from '@/hooks/use-toast';
import { useCallback, useEffect, useState, useRef } from 'react';
import { MarkdownNotesEditor } from './MarkdownNotesEditor';
import { EnhancedNotesSidebar } from './EnhancedNotesSidebar';
import { NotesWelcome } from './NotesWelcome';

// Cache for note content - moved to module level for persistence
const noteContentCache = new Map<string, Note>();

// Block Types
enum BlockType {
  TEXT = 'TEXT',
  HEADING_1 = 'HEADING_1',
  HEADING_2 = 'HEADING_2',
  HEADING_3 = 'HEADING_3',
  BULLET_LIST = 'BULLET_LIST',
  NUMBERED_LIST = 'NUMBERED_LIST',
  TODO = 'TODO',
  QUOTE = 'QUOTE',
  CODE = 'CODE',
  DIVIDER = 'DIVIDER',
  CALLOUT = 'CALLOUT',
  IMAGE = 'IMAGE',
}

interface Block {
  id: string;
  type: BlockType;
  content: string;
  properties?: {
    checked?: boolean;
    level?: number;
    color?: string;
    url?: string;
    alt?: string;
  };
  position: number;
}

interface Note {
  id: string;
  title?: string | null;
  icon?: string | null;
  coverImage?: string | null;
  isPublic: boolean;
  isArchived: boolean;
  isFavorite: boolean;
  workspaceId?: string | null;
  position: number;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    name: string;
    username: string;
    image?: string | null;
  };
  workspace?: {
    id: string;
    name: string;
    color: string;
  } | null;
  children: Array<{
    id: string;
    title?: string | null;
    icon?: string | null;
    position: number;
  }>;
  _count: {
    blocks: number;
    children: number;
  };
  blocks: Block[];
  content: string; // Markdown content field (required)
}

interface Workspace {
  id: string;
  name: string;
  color: string;
  image?: string | null;
}

interface CurrentUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  username: string;
}

interface NotesAppProps {
  notes: Note[];
  workspaces: Workspace[];
  currentUser: CurrentUser;
}

export function NotesApp({ notes, workspaces, currentUser }: NotesAppProps) {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [allNotes, setAllNotes] = useState<Note[]>(notes);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const loadingTimeoutRef = useRef<NodeJS.Timeout>();

  // Stable handleNoteSelect that won't cause cycles
  const selectingRef = useRef(false);
  const handleNoteSelect = useCallback(async (note: Note) => {
    // Prevent re-selecting the same note or concurrent selections
    if (selectedNote?.id === note.id || selectingRef.current) {
      return;
    }

    selectingRef.current = true;

    try {
      // Immediate UI update for instant feel
      setSelectedNote(note);

      // Check cache first for instant loading
      if (noteContentCache.has(note.id)) {
        const cachedNote = noteContentCache.get(note.id)!;
        setSelectedNote(cachedNote);
        return;
      }

      // Show loading state only for slow connections
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }

      loadingTimeoutRef.current = setTimeout(() => {
        setIsLoading(true);
      }, 150); // Only show loading after 150ms

      // Fetch full note details including content
      const response = await fetch(`/api/notes/${note.id}`);

      // Clear loading timeout
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      setIsLoading(false);

      if (response.ok) {
        const fullNote = await response.json();
        // Cache the note for instant future access
        noteContentCache.set(note.id, fullNote);
        setSelectedNote(fullNote);
      } else {
        console.error('Failed to fetch note details');
        setSelectedNote(note); // Fallback to provided note
      }
    } catch (error) {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      setIsLoading(false);
      console.error('Error fetching note details:', error);
      setSelectedNote(note); // Fallback to provided note
    } finally {
      selectingRef.current = false;
    }
  }, [selectedNote?.id]);

  // Store handleNoteSelect in ref to avoid dependency issues
  const handleNoteSelectRef = useRef(handleNoteSelect);
  useEffect(() => {
    handleNoteSelectRef.current = handleNoteSelect;
  }, [handleNoteSelect]);

  // Auto-select first note if available, but don't override user selection
  // Use a stable ref-based approach to prevent infinite loops
  const hasAttemptedAutoSelect = useRef(false);
  const lastNotesLength = useRef(allNotes.length);
  const lastSelectedId = useRef(selectedNote?.id);

  useEffect(() => {
    // Skip if nothing has actually changed
    if (hasAttemptedAutoSelect.current &&
        lastNotesLength.current === allNotes.length &&
        lastSelectedId.current === selectedNote?.id) {
      return;
    }

    lastNotesLength.current = allNotes.length;
    lastSelectedId.current = selectedNote?.id;

    const performAutoSelection = async () => {
      // Only auto-select if we don't have a note selected and notes are available
      if (allNotes.length > 0 && !selectedNote) {
        hasAttemptedAutoSelect.current = true;
        await handleNoteSelectRef.current(allNotes[0]);
      }
      // Clear selection if no notes available
      else if (allNotes.length === 0 && selectedNote) {
        setSelectedNote(null);
      }
      // Handle case where selected note no longer exists
      else if (selectedNote && !allNotes.find(note => note.id === selectedNote.id)) {
        if (allNotes.length > 0) {
          hasAttemptedAutoSelect.current = true;
          await handleNoteSelectRef.current(allNotes[0]);
        } else {
          setSelectedNote(null);
        }
      }
    };

    performAutoSelection();
  }, [allNotes.length, selectedNote?.id]); // Removed handleNoteSelect from dependencies

  // Reset auto-selection flag when notes are manually selected
  useEffect(() => {
    if (selectedNote) {
      hasAttemptedAutoSelect.current = false;
    }
  }, [selectedNote?.id]);

  // Preload note content for faster switching
  useEffect(() => {
    const preloadNotes = async () => {
      // Preload first 3 notes for instant access
      const notesToPreload = allNotes.slice(0, 3);
      for (const note of notesToPreload) {
        if (!noteContentCache.has(note.id)) {
          try {
            const response = await fetch(`/api/notes/${note.id}`);
            if (response.ok) {
              const fullNote = await response.json();
              noteContentCache.set(note.id, fullNote);
            }
          } catch (error) {
            // Silently fail for preloading
            console.debug('Preload failed for note:', note.id);
          }
        }
      }
    };

    // Preload after a short delay to avoid blocking initial render
    const preloadTimer = setTimeout(preloadNotes, 100);
    return () => clearTimeout(preloadTimer);
  }, [allNotes]);

  const handleNoteCreate = useCallback(async (noteData: Partial<Note>) => {
    if (isCreating) return;

    // Create optimistic note for instant UI feedback
    const optimisticNote: Note = {
      id: `temp-${Date.now()}`,
      title: noteData.title || 'Untitled',
      icon: noteData.icon || '📝',
      coverImage: null,
      isPublic: false,
      isArchived: false,
      isFavorite: false,
      workspaceId: noteData.workspaceId || null,
      position: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: {
        id: currentUser.id,
        name: currentUser.name,
        username: currentUser.username,
        image: currentUser.image,
      },
      workspace: null,
      children: [],
      _count: {
        blocks: 0,
        children: 0,
      },
      blocks: [], // Required by Note interface
      content: '# Welcome to your new note!\n\nStart writing your thoughts in **Markdown**...',
      ...noteData
    };

    // Immediate UI update
    setAllNotes(prev => [optimisticNote, ...prev]);
    setSelectedNote(optimisticNote);
    setIsCreating(true);

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: noteData.title || 'Untitled',
          icon: noteData.icon || '📝',
          isPublic: false,
          isFavorite: false,
          content: '# Welcome to your new note!\n\nStart writing your thoughts in **Markdown**...',
          ...noteData
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create note');
      }

      const newNote = await response.json();

      // Replace optimistic note with real note
      setAllNotes(prev => prev.map(note =>
        note.id === optimisticNote.id ? newNote : note
      ));
      setSelectedNote(newNote);

      // Cache the new note
      noteContentCache.set(newNote.id, newNote);

      toast({
        title: 'Note created',
        description: `"${newNote.title}" has been created successfully.`,
      });
    } catch (error) {
      console.error('Error creating note:', error);

      // Remove optimistic note on failure
      setAllNotes(prev => {
        const updatedNotes = prev.filter(note => note.id !== optimisticNote.id);
        return updatedNotes;
      });

      // Use functional update to avoid stale closure
      setSelectedNote(prev => {
        if (prev?.id === optimisticNote.id) {
          // Get current allNotes from state to avoid stale reference
          return null; // Will be set by auto-select effect
        }
        return prev;
      });

      toast({
        title: 'Error',
        description: 'Failed to create note. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  }, [isCreating, toast, currentUser]);

  // Global keyboard shortcuts for instant productivity - use refs to avoid dependency cycles
  const allNotesRef = useRef(allNotes);
  const selectedNoteRef = useRef(selectedNote);
  const handleNoteCreateRef = useRef(handleNoteCreate);

  // Update refs when values change
  useEffect(() => {
    allNotesRef.current = allNotes;
  }, [allNotes]);

  useEffect(() => {
    selectedNoteRef.current = selectedNote;
  }, [selectedNote]);

  useEffect(() => {
    handleNoteCreateRef.current = handleNoteCreate;
  }, [handleNoteCreate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + N for new note
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        handleNoteCreateRef.current({ title: 'Untitled', icon: '📝' });
      }

      // Ctrl/Cmd + K for search (focus search)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="Search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }

      // Arrow keys for note navigation (when not in editor)
      if (!document.activeElement?.matches('textarea, input[type="text"]')) {
        const currentNotes = allNotesRef.current;
        const currentSelected = selectedNoteRef.current;

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const currentIndex = currentNotes.findIndex(note => note.id === currentSelected?.id);
          const nextIndex = (currentIndex + 1) % currentNotes.length;
          if (currentNotes[nextIndex]) {
            handleNoteSelectRef.current(currentNotes[nextIndex]);
          }
        }

        if (e.key === 'ArrowUp') {
          e.preventDefault();
          const currentIndex = currentNotes.findIndex(note => note.id === currentSelected?.id);
          const prevIndex = currentIndex <= 0 ? currentNotes.length - 1 : currentIndex - 1;
          if (currentNotes[prevIndex]) {
            handleNoteSelectRef.current(currentNotes[prevIndex]);
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []); // Empty dependency array - use refs to access current values

  const handleNoteUpdate = useCallback(async (noteId: string, updates: Partial<Note>) => {
    // Store original note before optimistic update for potential rollback
    let originalNote: Note | undefined;

    // Optimistic update for instant UI feedback
    const optimisticUpdate = (note: Note) => ({ ...note, ...updates, updatedAt: new Date() });

    setAllNotes(prev => {
      const updated = prev.map(note => {
        if (note.id === noteId) {
          originalNote = note; // Store original for rollback
          return optimisticUpdate(note);
        }
        return note;
      });
      return updated;
    });

    setSelectedNote(prev => {
      if (prev?.id === noteId) {
        const optimisticNote = optimisticUpdate(prev);
        // Update cache immediately
        noteContentCache.set(noteId, optimisticNote);
        return optimisticNote;
      }
      return prev;
    });

    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update note');
      }

      const updatedNote = await response.json();

      // Update with server response
      setAllNotes(prev =>
        prev.map(note => note.id === noteId ? updatedNote : note)
      );

      setSelectedNote(prev => prev?.id === noteId ? updatedNote : prev);

      // Update cache with server response
      noteContentCache.set(noteId, updatedNote);
    } catch (error) {
      console.error('Error updating note:', error);

      // Revert optimistic update on failure using stored original
      if (originalNote) {
        setAllNotes(prev =>
          prev.map(note => note.id === noteId ? originalNote : note)
        );

        setSelectedNote(prev => {
          if (prev?.id === noteId) {
            noteContentCache.set(noteId, originalNote!);
            return originalNote;
          }
          return prev;
        });
      }

      toast({
        title: 'Error',
        description: 'Failed to update note. Please try again.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const handleNoteDelete = useCallback(async (noteId: string) => {
    try {
      const response = await fetch(`/api/notes/${noteId}?hard=true`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete note');
      }

      // Update notes list and handle selection logic
      setAllNotes(prev => {
        const updatedNotes = prev.filter(note => note.id !== noteId);

        // If the deleted note was selected, update selection
        if (selectedNote?.id === noteId) {
          // Select the first available note or null if no notes remain
          const nextNote = updatedNotes.length > 0 ? updatedNotes[0] : null;
          setSelectedNote(nextNote);
        }

        return updatedNotes;
      });

      // Remove from cache
      noteContentCache.delete(noteId);

      toast({
        title: 'Note deleted',
        description: 'The note has been permanently deleted.',
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete note. Please try again.',
        variant: 'destructive',
      });
    }
  }, [selectedNote, toast]);

  return (
    <AutosaveIndicatorProvider>
      <div className="flex h-screen bg-background overflow-hidden">
        <EnhancedNotesSidebar
          notes={allNotes}
          workspaces={workspaces}
          currentUser={currentUser}
          selectedNote={selectedNote}
          collapsed={sidebarCollapsed}
          onNoteSelect={handleNoteSelect}
          onNoteCreate={handleNoteCreate}
          onNoteUpdate={handleNoteUpdate}
          onNoteDelete={handleNoteDelete}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          isCreating={isCreating}
        />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {selectedNote ? (
            <MarkdownNotesEditor
              key={selectedNote.id}
              note={selectedNote}
              onNoteUpdate={handleNoteUpdate}
              onNoteDelete={handleNoteDelete}
              isLoading={isLoading}
            />
          ) : (
            <NotesWelcome
              currentUser={currentUser}
              onCreateNote={handleNoteCreate}
            />
          )}
        </div>
      </div>
    </AutosaveIndicatorProvider>
  );
}
