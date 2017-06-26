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
			if (state.id !== action.id) {
				return state;
			}
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

const visibilityFliter = (
	state = 'SHOW_ALL',
	action
) => {
	switch (action.type) {
		case 'SET_VISIBILITY_FILTER':
			return action.filter;
		default:
			return state;
	}
};

const todoApp = (state = {}, action) => {
	return {
		todos: todos(
			state.todos,
			action
		),
		visibilityFliter: visibilityFliter(
			state.visibilityFliter,
			action
		)
	};
};

const { createStore } = Redux;
// const store = createStore(todos);
const store = createStore(todoApp);

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

log('Dispatching SET_VISIBILITY_FILTER');
store.dispatch({
	type: 'SET_VISIBILITY_FILTER',
	filter: 'SHOW_COMPLETED'
});
log('current state-----');
log(store.getState());















