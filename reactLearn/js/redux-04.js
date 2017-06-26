// reducer composition with arrays and objects
const todo = (state, action) => {
	switch (action.type) {
		case 'ADD_TODO':
			return {
				id: action.id,
				text: action.text,
				completed: false
			};
		case 'TOGGLE_TODO':
			debugger;
			if (state.id !== action.id) {
				return state;
			}
			debugger;
			return {
				...state,
				completed: !state.completed
			};
		default:
			return state;
	}
};

const todos = (state = [], action) => {
	switch (action.type) {
		case 'ADD_TODO':
			return [
				...state,
				todo(undefined, action)
			];
		case 'TOGGLE_TODO':
			return state.map(t => todo(t, action));
		default:
			return state;
	}
};

const { createStore } = Redux;
const store = createStore(todos);

const log = (obj) => {
	console.log(obj);
};
log('current state-----');
log(store.getState());

log('Dispatching ADD_TODO');
store.dispatch({
	type: 'ADD_TODO',
	id: 0,
	text:'Learn redux'
});
log('current state-----');
log(store.getState());

log('Dispatching ADD_TODO');
store.dispatch({
	type: 'ADD_TODO',
	id: 1,
	text:'Go shopping'
});
log('current state-----');
log(store.getState());

log('Dispatching TOGGLE_TODO');
store.dispatch({
	type: 'TOGGLE_TODO',
	id: 0
});
log('current state-----');
log(store.getState());















