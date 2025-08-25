'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit3,
  FileText,
  Heart,
  MoreHorizontal,
  Plus,
  Search,
  Star,
  Trash2
} from 'lucide-react';
import React, { useMemo, useState, useCallback, memo } from 'react';

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

interface EnhancedNotesSidebarProps {
  notes: Note[];
  workspaces: Workspace[];
  currentUser: CurrentUser;
  selectedNote: Note | null;
  collapsed: boolean;
  onNoteSelect: (note: Note) => void;
  onNoteCreate: (noteData: Partial<Note>) => void;
  onNoteUpdate: (noteId: string, updates: Partial<Note>) => void;
  onNoteDelete: (noteId: string) => void;
  onToggleCollapse: () => void;
  isCreating?: boolean;
}

export const EnhancedNotesSidebar = memo(function EnhancedNotesSidebar({
  notes,
  workspaces,
  currentUser,
  selectedNote,
  collapsed,
  onNoteSelect,
  onNoteCreate,
  onNoteUpdate,
  onNoteDelete,
  onToggleCollapse,
  isCreating = false,
}: EnhancedNotesSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    favorites: true,
    recent: true,
    all: false,
  });

  const filteredNotes = useMemo(() => {
    if (!searchQuery) return notes;
    return notes.filter(note =>
      note.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [notes, searchQuery]);

  const organizedNotes = useMemo(() => {
    const favoriteNotes = filteredNotes.filter(note => note.isFavorite);

    // Recent notes: non-favorite notes, sorted by update time, limited to 10 for performance
    const recentNotes = filteredNotes
      .filter(note => !note.isFavorite)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 10);

    // All notes: paginated for virtual scrolling (show first 50 by default)
    const allNotes = filteredNotes
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 50); // Limit for performance

    return { favoriteNotes, recentNotes, allNotes };
  }, [filteredNotes]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCreateNote = useCallback(() => {
    onNoteCreate({
      title: 'Untitled',
      icon: '📝',
      isPublic: false,
      isFavorite: false,
    });
  }, [onNoteCreate]);

  const handleToggleFavorite = useCallback(async (note: Note, e: React.MouseEvent) => {
    e.stopPropagation();
    onNoteUpdate(note.id, { isFavorite: !note.isFavorite });
  }, [onNoteUpdate]);

  const handleDeleteNote = useCallback(async (note: Note, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${note.title || 'Untitled'}"?`)) {
      onNoteDelete(note.id);
    }
  }, [onNoteDelete]);

  const handleNoteSelect = useCallback((note: Note) => {
    onNoteSelect(note);
  }, [onNoteSelect]);

  const formatDate = (date: Date) => {
    const now = new Date();
    const noteDate = new Date(date);
    const diffInHours = (now.getTime() - noteDate.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 24 * 7) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return noteDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const NoteItem = memo(({ note, showDate = false }: { note: Note; showDate?: boolean }) => (
    <div
      className={cn(
        "group flex items-start p-3 rounded-lg cursor-pointer transition-all duration-200",
        "hover:bg-accent/50 border border-transparent",
        "bg-card/50 hover:bg-accent/70",
        selectedNote?.id === note.id && "bg-accent border-primary/20 shadow-sm ring-1 ring-primary/10",
      )}
      onClick={() => handleNoteSelect(note)}
    >
      <div className="flex items-start flex-1 min-w-0 gap-3">
        <div className="text-lg flex-shrink-0 mt-0.5 w-8 h-8 rounded-md bg-accent/30 flex items-center justify-center">
          {note.icon || '📝'}
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-start gap-2">
            <span className="font-semibold text-sm text-foreground leading-tight flex-1 min-w-0 truncate">
              {note.title || 'Untitled'}
            </span>
            {note.isFavorite && (
              <div className="flex-shrink-0 w-4 h-4 rounded-full bg-yellow-500/20 flex items-center justify-center mt-0.5">
                <Heart className="w-2.5 h-2.5 text-yellow-600 fill-current" />
              </div>
            )}
          </div>
          {showDate && (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                <Clock className="w-3 h-3 flex-shrink-0 text-foreground/60" />
                <span className="truncate text-xs text-foreground/70 font-medium">Updated {formatDate(note.updatedAt)}</span>
              </div>
              {note._count.blocks > 0 && (
                <div className="flex-shrink-0">
                  <Badge
                    variant="secondary"
                    className="text-xs px-2 py-0.5 h-5 font-medium text-foreground/70 bg-foreground/10"
                  >
                    {note._count.blocks} block{note._count.blocks !== 1 ? 's' : ''}
                  </Badge>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-start space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-200 ml-2 mt-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-muted-foreground hover:text-yellow-500 hover:bg-yellow-500/10 rounded-md"
          onClick={(e) => handleToggleFavorite(note, e)}
        >
          <Star className={cn("w-3.5 h-3.5", note.isFavorite && "fill-yellow-400 text-yellow-500")} />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <Edit3 className="w-4 h-4 mr-2" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => handleToggleFavorite(note, e)}>
              <Star className="w-4 h-4 mr-2" />
              {note.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={(e) => handleDeleteNote(note, e)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  ));

  const SectionHeader = ({ title, count, expanded, onToggle, icon: Icon }: {
    title: string;
    count: number;
    expanded: boolean;
    onToggle: () => void;
    icon: React.ComponentType<{ className?: string }>;
  }) => (
    <button
      onClick={onToggle}
      className="flex items-center w-full text-left mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors group"
    >
      <Icon className="w-3 h-3 mr-2" />
      <span className="flex-1">{title}</span>
      <Badge variant="secondary" className="text-xs px-1.5 py-0 h-4 mr-2">
        {count}
      </Badge>
      {expanded ? (
        <ChevronDown className="w-3 h-3 transition-transform" />
      ) : (
        <ChevronRight className="w-3 h-3 transition-transform" />
      )}
    </button>
  );

  if (collapsed) {
    return (
      <div className="w-16 border-r border-border bg-background flex flex-col items-center py-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="mb-4 text-muted-foreground hover:text-foreground"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleCreateNote}
          disabled={isCreating}
          className="mb-4 text-muted-foreground hover:text-foreground"
        >
          <Plus className="w-4 h-4" />
        </Button>

        <div className="space-y-2">
          {notes.slice(0, 5).map((note) => (
            <Button
              key={note.id}
              variant="ghost"
              size="sm"
              onClick={() => onNoteSelect(note)}
              className={cn(
                "w-10 h-10 p-0 text-lg",
                selectedNote?.id === note.id && "bg-accent"
              )}
            >
              {note.icon || '📝'}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 border-r border-border bg-background flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <FileText className="w-5 h-5 text-muted-foreground mr-2" />
            <h1 className="text-lg font-semibold text-foreground">Notes</h1>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCreateNote}
              disabled={isCreating}
              className="text-muted-foreground hover:text-foreground"
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-9 text-sm bg-background border-input"
          />
        </div>
      </div>

      {/* Notes List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Favorites */}
          {organizedNotes.favoriteNotes.length > 0 && (
            <div>
              <SectionHeader
                title="Favorites"
                count={organizedNotes.favoriteNotes.length}
                expanded={expandedSections.favorites}
                onToggle={() => toggleSection('favorites')}
                icon={Star}
              />
              {expandedSections.favorites && (
                <div className="space-y-1">
                  {organizedNotes.favoriteNotes.map((note) => (
                    <NoteItem key={note.id} note={note} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Recent */}
          <div>
            <SectionHeader
              title="Recent"
              count={organizedNotes.recentNotes.length}
              expanded={expandedSections.recent}
              onToggle={() => toggleSection('recent')}
              icon={Clock}
            />
            {expandedSections.recent && (
              <div className="space-y-1">
                {organizedNotes.recentNotes.length > 0 ? (
                  organizedNotes.recentNotes.map((note) => (
                    <NoteItem key={note.id} note={note} />
                  ))
                ) : (
                  <div className="text-xs text-muted-foreground py-2 px-3">
                    {organizedNotes.favoriteNotes.length > 0
                      ? 'All your notes are favorited! ⭐'
                      : 'No recent notes yet'}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* All Notes */}
          {(organizedNotes.allNotes.length > 5 || expandedSections.all) && (
            <div>
              <SectionHeader
                title="All Notes"
                count={organizedNotes.allNotes.length}
                expanded={expandedSections.all}
                onToggle={() => toggleSection('all')}
                icon={FileText}
              />
              {expandedSections.all && (
                <div className="space-y-1">
                  {organizedNotes.allNotes.map((note) => (
                    <NoteItem key={note.id} note={note} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {filteredNotes.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-sm font-medium text-foreground mb-2">
                {searchQuery ? 'No notes found' : 'No notes yet'}
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                {searchQuery
                  ? 'Try adjusting your search terms'
                  : 'Create your first note to get started'
                }
              </p>
              {!searchQuery && (
                <Button
                  onClick={handleCreateNote}
                  disabled={isCreating}
                  size="sm"
                  className="text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  New Note
                </Button>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
});
