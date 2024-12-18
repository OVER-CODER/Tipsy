console.log("Injected script running");

const originalConsoleError = console.error;
console.error = function(...args) {
  window.postMessage({ type: 'site-error', payload: args }, '*');
  originalConsoleError.apply(console, args);
};

window.onerror = function(message, source, lineno, colno, error) {
  const errorMessage = error ? error.message : message;
  window.postMessage({
    type: 'site-error',
    payload: { message: errorMessage, source, lineno, colno, stack: error?.stack }
  }, '*');
};

window.addEventListener('unhandledrejection', (event) => {
  const errorMessage = event.reason ? event.reason.message : 'Unhandled rejection occurred';
  window.postMessage({
    type: 'site-error',
    payload: { message: errorMessage, stack: event.reason?.stack }
  }, '*');
});