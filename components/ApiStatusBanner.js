import React, { useState, useEffect } from 'react';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ApiStatusBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch('/api/test', { 
          method: 'GET',
          timeout: 3000 
        });
        
        if (response.ok) {
          setApiStatus('online');
          setShowBanner(false);
        } else {
          setApiStatus('offline');
          setShowBanner(true);
        }
      } catch (error) {
        setApiStatus('offline');
        setShowBanner(true);
      }
    };

    checkApiStatus();
    
    // Verificar status a cada 30 segundos
    const interval = setInterval(checkApiStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!showBanner) return null;

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-yellow-700">
            <strong>Modo Offline:</strong> As APIs do sistema não estão disponíveis. 
            Alguns dados podem não estar atualizados. O sistema está funcionando com dados locais.
          </p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              onClick={() => setShowBanner(false)}
              className="inline-flex bg-yellow-50 rounded-md p-1.5 text-yellow-500 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-50 focus:ring-yellow-600"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiStatusBanner;