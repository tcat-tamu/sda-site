/*eslint-env amd,browser,node*/
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.EventDispatcher = factory();
  }
})(this, function () {
  'use strict';

  /**
   * Creates a new simple event dispatcher object that handles listener registration and event triggering.
   */
  function EventDispatcher() {
    /**
     * Map of event name to registered event handlers
     * @type {object.<string,function[]>}
     */
    var eventHandlers = {};

    /**
     * List of registered global event handlers
     * @type {function[]}
     */
    var globalHandlers = [];

    ////////////////////////////////////////////////////////////

    var API = {};
    API.all = addGlobalListener;
    API.on = addListener;
    API.once = addOnceListener;
    API.trigger = trigger;
    return API;

    ////////////////////////////////////////////////////////////

    /**
     * Trigger the named event, passing the given context to all registered event handlers
     * @param {string} eventName
     * @param {object} context
     */
    function trigger(eventName, context) {
      if (eventHandlers[eventName]) {
        eventHandlers[eventName].forEach(function (handler) {
          try {
            handler(context);
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error(e);
          }
        });
      }

      globalHandlers.forEach(function (handler) {
        try {
          handler(eventName, context);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e);
        }
      });
    }

    /**
     * Attach an event handler that will be triggered for all events
     * @param {function} handler
     * @return {function} deregistration function
     */
    function addGlobalListener(handler) {
      globalHandlers.push(handler);

      return function () {
        var ix = globalHandlers.indexOf(handler);
        if (ix >= 0) {
          globalHandlers.splice(ix, 1);
        }
      }
    }

    /**
     * Attach an event handler to the given event name.
     * @param {string} eventName
     * @param {function} handler
     * @return {function} deregistration function
     */
    function addListener(eventName, handler) {
      if (!eventHandlers[eventName]) {
        eventHandlers[eventName] = [];
      }

      eventHandlers[eventName].push(handler);

      return function () {
        var ix = eventHandlers[eventName].indexOf(handler);
        if (ix >= 0) {
          eventHandlers[eventName].splice(ix, 1);
        }
      }
    }

    /**
     * Attach an event listener to the given event name that will automatically deregister after it has been fired.
     * @param {string} eventName
     * @param {function} handler
     * @return {function} deregistration function
     */
    function addOnceListener(eventName, handler) {
      var deregister = addListener(eventName, function (context) {
        try {
          handler(context);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e);
        } finally {
          deregister();
        }
      });

      return deregister;
    }
  }

  return EventDispatcher;

});
