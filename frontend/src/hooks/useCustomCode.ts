import { useEffect, useState } from 'react';
import { settingsService } from '../services/settingsService';

interface CustomCode {
  headerCode: string;
  footerCode: string;
  customCSS: string;
  customJS: string;
}

export function useCustomCode() {
  const [customCode, setCustomCode] = useState<CustomCode>({
    headerCode: '',
    footerCode: '',
    customCSS: '',
    customJS: '',
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadCustomCode();
  }, []);

  const loadCustomCode = async () => {
    try {
      const settings = await settingsService.getSettings();
      if (settings.customCode) {
        setCustomCode(settings.customCode);
      }
    } catch (error) {
      console.error('Failed to load custom code:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  // Inject header code
  useEffect(() => {
    if (!isLoaded || !customCode.headerCode) return;

    const container = document.createElement('div');
    container.innerHTML = customCode.headerCode;
    
    // Append all elements to head
    Array.from(container.children).forEach((element) => {
      document.head.appendChild(element.cloneNode(true));
    });

    return () => {
      // Cleanup on unmount (optional)
      const existing = document.head.querySelector(`[data-custom-header]`);
      if (existing) existing.remove();
    };
  }, [customCode.headerCode, isLoaded]);

  // Inject footer code
  useEffect(() => {
    if (!isLoaded || !customCode.footerCode) return;

    const container = document.createElement('div');
    container.innerHTML = customCode.footerCode;
    
    // Append all elements before closing body tag
    Array.from(container.children).forEach((element) => {
      document.body.appendChild(element.cloneNode(true));
    });

    return () => {
      // Cleanup on unmount (optional)
      const existing = document.body.querySelector(`[data-custom-footer]`);
      if (existing) existing.remove();
    };
  }, [customCode.footerCode, isLoaded]);

  // Inject custom CSS
  useEffect(() => {
    if (!isLoaded || !customCode.customCSS) return;

    const style = document.createElement('style');
    style.setAttribute('data-custom-css', 'true');
    style.textContent = customCode.customCSS;
    document.head.appendChild(style);

    return () => {
      style.remove();
    };
  }, [customCode.customCSS, isLoaded]);

  // Inject custom JS
  useEffect(() => {
    if (!isLoaded || !customCode.customJS) return;

    const script = document.createElement('script');
    script.setAttribute('data-custom-js', 'true');
    script.textContent = customCode.customJS;
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, [customCode.customJS, isLoaded]);

  return { customCode, isLoaded };
}
