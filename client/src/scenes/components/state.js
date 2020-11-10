(function(ns) {
  /**
   * State machine component
   * Based on Xstate <https://xstate.js.org/>
   * @type {{_stateMachine: undefined, onTranstionListener: ns.State.onTranstionListener, createStateMachine: ns.State.createStateMachine, _stateMachineService: undefined}}
   */
  ns.State = {
    _stateMachine: undefined,
    _stateMachineService: undefined,

    state: undefined,

    /**
     * Creates and starts state machhine for this gameobject
     * @param config
     * @param options
     */
    createStateMachine: function(config, options) {
      this._stateMachine = XState.Machine(config, options);
      this._stateMachineService = XState.interpret(this._stateMachine);
      this._stateMachineService.onTransition(this.onTranstionListener.bind(this));
      this._stateMachineService.start();
    },

    /**
     * Listener to set gameobject state on state change
     * @param state
     */
    onTranstionListener: function(state) {
      this.setState(state.value);
    },

    /**
     * Sends an event to the state machine...
     * @param event
     */
    sendStateEvent: function(event) {
      if(this._stateMachineService !== undefined) {
        this._stateMachineService.send(event);
      }
    },

    setState: function(state) {
      this.state = state;
    },

    getState: function() {
      return this.state;
    }
  }
})(candlegamestools.namespace('candlegames.pestis.scenes.components'));
