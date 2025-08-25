'use client';

import { Button } from '@/components/ui/button';
import {
  FileText,
  Plus,
  Star,
  Zap
} from 'lucide-react';

interface CurrentUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  username: string;
}

interface NotesWelcomeProps {
  currentUser: CurrentUser;
  onCreateNote: (noteData: Partial<any>) => void;
}

export function NotesWelcome({ currentUser, onCreateNote }: NotesWelcomeProps) {
  const handleCreateNote = (template?: string) => {
    const templates = {
      blank: {
        title: 'Untitled',
        icon: '📝',
      },
      meeting: {
        title: 'Meeting Notes',
        icon: '📋',
      },
      project: {
        title: 'Project Plan',
        icon: '🎯',
      },
      journal: {
        title: 'Daily Journal',
        icon: '📔',
      },
    };

    const noteData = templates[template as keyof typeof templates] || templates.blank;
    onCreateNote(noteData);
  };

  const features = [
    {
      icon: Zap,
      title: 'Markdown Editor',
      description: 'Write in markdown with live preview mode - headers, lists, code blocks, and more'
    },
    {
      icon: FileText,
      title: 'Edit & Preview',
      description: 'Switch seamlessly between markdown editing and live preview modes'
    },
    {
      icon: Star,
      title: 'Auto-Save & Organize',
      description: 'Your notes are automatically saved and easily organized with favorites'
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-background overflow-hidden">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto scrollbar-enhanced">
        <div className="max-w-4xl mx-auto text-center w-full">
          {/* Create Note Section - Moved to top */}
          <div className="mb-16">
            <div className="w-24 h-24 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Welcome to Notes, {currentUser.name || currentUser.username}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Capture ideas, organize thoughts, and create beautiful documents with our
              Obsidian-style markdown editor. Start writing in markdown and switch to preview mode.
            </p>
            <Button
              onClick={() => handleCreateNote('blank')}
              size="lg"
              className="px-8 py-3 text-lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Note
            </Button>
          </div>

          {/* Features */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-8">
              Powerful markdown editor features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
