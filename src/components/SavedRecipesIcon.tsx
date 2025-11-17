import { Bookmark } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { SavedRecipesSidebar } from './SavedRecipesSidebar';

export function SavedRecipesIcon() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // Close dropdown when clicking outside (desktop only)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!isMobile && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen && !isMobile) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, isMobile]);

  // Close on Escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Saved recipes"
      >
        <Bookmark className="w-6 h-6 text-gray-700" />
      </button>

      {isOpen && <SavedRecipesSidebar onClose={() => setIsOpen(false)} isMobile={isMobile} />}
    </div>
  );
}
