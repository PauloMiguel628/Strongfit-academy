import { useCallback } from 'react';

export const useDynatrace = () => {
  
  const sendAction = useCallback((actionName, attributes = {}) => {
    console.log(`[Dynatrace Action] ${actionName}`, attributes);
    
    if (window.dtrum) {
      // Como as suas actions já estavam funcionando, mantivemos a sua estrutura exata
      const actionId = window.dtrum.enterAction(actionName, 'custom', null, null);
      
      Object.entries(attributes).forEach(([key, value]) => {
        window.dtrum.addActionProperties(actionId, null, null, { [key]: String(value) });
      });
      
      window.dtrum.leaveAction(actionId);
    }
  }, []);

  const reportError = useCallback((errorName, errorObj, context = {}) => {
    console.error(`[Dynatrace Error] ${errorName}`, errorObj, context);
    
    if (window.dtrum) {
      // 1. Extraímos a string da mensagem de erro para não enviar objetos crus que quebram o dtrum
      const errorMessage = errorObj instanceof Error ? errorObj.message : String(errorObj);
      
      // 2. Chamamos a API do Dynatrace usando apenas os argumentos suportados: Nome e Mensagem
      window.dtrum.reportCustomError(errorName, errorMessage);
    }
  }, []);

  return { sendAction, reportError };
};