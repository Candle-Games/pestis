(function(ns) {
  function CommsSystem(pluginManager) {
    Phaser.Plugins.BasePlugin.call(this, pluginManager);

    /**
     * Current socket.io connection
     * @type {io}
     */
    this.socket;

    /**
     * Event emitter
     * @type {Phaser.Events.EventEmitter}
     */
    this.emitter;

    /**
     * Is connection with server up
     * @type {boolean}
     */
    this.online = true;

    /**
     * Loop messages to local
     * @type {boolean}
     */
    this.loop = false;

    /**
     * Current server url
     * @type {string} url to connect
     */
    this.server;
  }

  CommsSystem.prototype = Object.create(Phaser.Plugins.BasePlugin.prototype);
  CommsSystem.prototype.constructor = CommsSystem;

  /**
   * Sets loop mode.
   * In loop mode the commands are passed to local systems instead of beeing routed through
   * server, both in online and offline mode.
   * @param value {boolean} wether to set loop mode (true) or not (false - default)
   */
  CommsSystem.prototype.setLoop = function(value) {
    this.loop = value || false;
  }

  /**
   * Called when this plugin is instantiated
   */
  CommsSystem.prototype.setup = function(configuration) {
    this.configuration = configuration;

    this.server = this.configuration.server;
    this.socket = io(this.server, { secure: true, reconnection: true });

    this.socket.on('connect', function() {
      console.log('Connection stablished, switching to online mode');
      this.online = true;
    }.bind(this));

    this.socket.on('connect_error', function() {
      console.log('The connection failed, switching to offline mode');
      this.online = false;
    }.bind(this));

    this.emitter = new Phaser.Events.EventEmitter();
  }

  /**
   * Sends messages to:
   * - Server if server connected
   * - Local emitter if server disconnected
   *
   * @param event event to send
   * @param data data to send
   */
  CommsSystem.prototype.emit = function(event, data) {
    if(this.loop || !this.online) {
      this._sendToEmitter(event, data, false);
    } else {
      this.socket.emit(event, data);
    }
  }

  /**
   * Sends data through emitter
   * Data can come from server if received by socket or locally of disconnected or loop mode
   * Message sent: {
   *   data: data to send,
   *   server: true if server data, false y local data
   * }
   * @param event event
   * @param data data
   * @param isServer
   * @private
   */
  CommsSystem.prototype._sendToEmitter = function(event, data, isServer) {
    data['_isServer'] = isServer;
    this.emitter.emit(event, data, this);
  }

  /**
   * Adds a listener for an event
   * @param event Event to subscribe
   * @param callback Callback function to subscribe to event
   * @param context Context (default this)
   */
  CommsSystem.prototype.on = function(event, callback, context) {
    if(!this.socket.hasListeners(event)) {
      this.socket.on(event, this._socketToEmitter(event));
    }

    this.emitter.on(event, callback, context || this);
  }

  /**
   * Adds a one time listener for an event
   * Gets removed after first execution
   * @param event Event to subscribe
   * @param callback Callback function to subscribe to event
   * @param context Context (default this)
   */
  CommsSystem.prototype.once = function(event, callback, context) {
    if(!this.socket.hasListeners(event)) {
      this.socket.once(event, this._socketToEmitter(event));
    }

    this.emitter.once(event, callback, context || this);
  }

  /**
   * Remove a listener for an event
   * Gets removed after first execution
   * @param event Event to subscribe
   * @param callback Callback function to subscribe to event (default all)
   * @param context Context (default this)
   * @param once Applies only to one time listeners
   */
  CommsSystem.prototype.off = function(event, callback, context, once) {
    if(!this.socket.hasListeners(event)) {
      this.socket.off(event, this._socketToEmitter(event));
    }

    this.emitter.off(event, callback, context, once);
  }

  /**
   * Returns a function to redirect socket input to emitter
   * @param event
   * @return {function(*=): void}
   * @private
   */
  CommsSystem.prototype._socketToEmitter = function(event) {
    return function(data) {
      this._sendToEmitter(event, data, true);
    }.bind(this);
  }

  ns.CommsSystem = CommsSystem;
})(candlegamestools.namespace('candlegames.pestis.client.plugins'));
