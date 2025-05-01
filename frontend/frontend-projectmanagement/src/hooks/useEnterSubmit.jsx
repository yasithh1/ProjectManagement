import { useEffect } from 'react';

const useEnterSubmit = (onSubmit) => {
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onSubmit();
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [onSubmit]);
};

export default useEnterSubmit;
