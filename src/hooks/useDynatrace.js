import { useCallback } from 'react';

export const useDynatrace = () => {
  const sendAction = useCallback((actionName, attributes = {}) => {
    console.log(`[Dynatrace Action] ${actionName}`, attributes);
    if (window.dtrum) {
      const actionId = window.dtrum.enterAction(actionName, 'custom', null, null);
      Object.entries(attributes).forEach(([key, value]) => {
        window.dtrum.addActionProperties(actionId, null, null, { [key]: value });
      });
      window.dtrum.leaveAction(actionId);
    }
  }, []);

  const reportError = useCallback((errorName, errorObj, context = {}) => {
    console.error(`[Dynatrace Error] ${errorName}`, errorObj, context);
    if (window.dtrum) {
      window.dtrum.reportCustomError(errorName, errorObj, context.plano || 'N/A', true);
    }
  }, []);

  return { sendAction, reportError };
};