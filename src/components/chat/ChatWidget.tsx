import React, { useState, Suspense, lazy } from 'react';
import { ChatLauncher } from './ChatLauncher';

// Lazy load ChatWindow to preserve Lighthouse performance score
const ChatWindow = lazy(() =>
  import('./ChatWindow').then((mod) => ({ default: mod.ChatWindow }))
);

export const ChatWidget: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <ChatLauncher
        isChatOpen={isChatOpen}
        onOpenAiChat={() => setIsChatOpen(true)}
      />

      {isChatOpen && (
        <Suspense fallback={null}>
          <ChatWindow
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
          />
        </Suspense>
      )}
    </>
  );
};
