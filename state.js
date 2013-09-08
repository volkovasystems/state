/*
	A state is defined as the component of flow.
	A flow is a dynamic state.
	A flow consist of states and sequences.
	State defines the meta and sequence defines the transition.
	Therefore, flow defines the meta of transition.

	How do we define a state?
	A state is composed of several sub-states.
	A state can never be alone.
	A state comprises of how it should be.
	A state is not a type but can be.
	A state suggest the current composition of the flow.

	The one that held a state will be affected by how
		the state can be "interpreted". (state controllers)

	States should have order. Because the chronological
		arrangement defines its "how". (state order)

	State is defined by it's current state and general state.

	General state is the "summary" of all states.

	Current states are the list of current state at the moment
		that defines the flow at the moment. (temporal definition)

	State value should contain primitive data. (numbers, booleans, strings, null)

	State format:
		mainState-subState-subStates...

		A state definition consists of a token of main state
			and tokens of sub states all separated by dashes.
		Each token is a word all in lower case and should only
			contain characters from a-z

	States should be maintained by a state engine.

	State engine should update the states by verifying controllers.

	The OO concept of state. In the concept of flow,
		two states A and B such that A is origin and B is destination
		and A != B implies that the entity embodying state A
		and state B should not be classed as one.

	If state A is created from a blueprint state X then
		state B should not be created on the same blueprint state X
		but rather adapts blueprint state X.

	Therefore, there will be lots of blueprint state X instances
		if you have lots of state.

	An object can only have 1 state container. And states are merged
		if the object flows to another object.

	If states of object A overlaps some states of object B,
		overlapping states adapts the destination state's states.

	And object A becomes object B (do not interpret it that way).

	Special function of the State is that all Meta properties that
		contains boolean values will be interpreted as flags.

	All flags are boolean states.
*/


function State( states ){
	if( this instanceof State ){
		//Ensure that it is a state provided with a date.
		/*
			This will force the State to be instantiated like this,

				var state = State( );
		*/
		if( !( "date" in this ) ){
			throw new Error( "invalid state instantiation" );
		}

		//Cache first the properties here so that we will loop them aftewards.
		//Each state is formatted like this:
		/*
			state = {
				"value": 
				"hash":
				"controller":
				"order":
			}
		*/
		var properties = {
			"states": [ ],
			"currentStates": { },
			"generalState": { },
			"stateOrder": { }
		};

		for( var key in properties ){
			Object.defineProperty( key, this,
				{
					"enumerable": false,
					"configurable": false,
					"writable": false,
					"value": properties[ key ]
				} );
		}

		//Encode the initial states to the State object.
		if( states !== undefined ){
			for( var key in states ){
				this.set( key, states[ key ] );
			}
		}
	}else{
		try{
			//Extract the Meta class.
			if( !( "meta" in State ) ){
				var meta = Meta || require( "meta/meta.js" ).Meta;
				Object.defineProperty( "meta", State,
					{
						"enumerable": false,
						"configurable": false,
						"writable": false,
						"value": meta
					} );
			}
		}catch( exception ){ 
			//It means we don't have Meta class. And that's ok.
		}
		
		//Preserve the original prototype so that we can put it back.
		var originalPrototype = State.prototype;
		
		try{
			//Construct a new meta state. This meta state is the blueprint.
			var state = function State( ){
				Object.defineProperty( "date", state,
					{
						"enumerable": false,
						"configurable": false,
						"writable": false,
						"value": Date.now( )
					} );
			};

			//If there is a Meta class create an instance of it.
			//This will presume all State objects as instances of Meta class.
			if( "meta" in State ){
				state.prototype = new State.meta( );	
			}else{
				if( states === undefined ){
					states = { };
				}
				states.nonMetaState = true;
			}

			//Merged enumerable prototypes.
			for( var key in State.prototype ){
				state.prototype[ key ] = State.prototype[ key ];
			}

			//Set the meta state as the prototype of the State at the moment.
			//This is where the magic happens.
			/*
				We don't want each state to be the blueprint of the original state.
				Though we want that each state will adapt the main blueprint,
					we want that each state is unique to the ancestral level.
			*/
			State.prototype = new state( );

			//Create the state.
			var newState = new State( states );

			//NOTE: Do not overwrite metaState of the State object.
			Object.defineProperty( "metaState", newState,
				{
					"enumerable": false,
					"configurable": false,
					"writable": false,
					"value": state
				} );

			return newState;
		}finally{
			//We make use of the best functionality of finally block :)
			//Finally blocks overrides return procedure. 
			//This will be executed after return.
			State.prototype = originalPrototype;
		}
	}
};

State.prototype.set = function set( state, value ){

};

State.prototype.deactivate = function deactivate( state ){

};

State.prototype.merge = function merge( state ){

};

State.prototype.on = function on( state, controller ){

};