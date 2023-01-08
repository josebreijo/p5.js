interface RequestIdleCallbackFn {
  (options: { didTimeout: boolean; timeRemaining: () => number }): void;
}
/**
 * @see https://developers.google.com/web/updates/2015/08/using-requestidlecallback
 */
const requestIdleCallback =
  window.requestIdleCallback ||
  function requestIdleCallback(callbackFn: RequestIdleCallbackFn) {
    return setTimeout(function () {
      var start = Date.now();
      callbackFn({
        didTimeout: false,
        timeRemaining: function () {
          return Math.max(0, 50 - (Date.now() - start));
        },
      });
    }, 1);
  };

/**
 * @see https://developers.google.com/web/updates/2015/08/using-requestidlecallback
 */
const cancelIdleCallback =
  window.cancelIdleCallback ||
  function cancelIdleCallback(callbackId: number) {
    clearTimeout(callbackId);
  };

export default { requestIdleCallback, cancelIdleCallback };
