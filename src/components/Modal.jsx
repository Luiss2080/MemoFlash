import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useId, useRef } from 'react';

export function Modal({ isOpen, onClose, title, children }) {
  const titleId = useId();
  const closeButtonRef = useRef(null);
  const previouslyFocusedRef = useRef(null);

  // Focus management: move focus into the dialog when it opens, and give it
  // back to whatever triggered it when it closes, so keyboard/screen-reader
  // users never lose their place behind the (now invisible) overlay.
  useEffect(() => {
    if (isOpen) {
      previouslyFocusedRef.current = document.activeElement;
      closeButtonRef.current?.focus();
    } else {
      previouslyFocusedRef.current?.focus?.();
    }
  }, [isOpen]);

  // Close on Escape, matching standard dialog behavior.
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="modal-content"
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="modal-header">
              <h2 id={titleId}>{title}</h2>
              <button ref={closeButtonRef} className="btn-close" onClick={onClose} aria-label="Cerrar modal">
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
