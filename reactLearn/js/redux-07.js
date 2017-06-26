// 拆分reducer
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

// 用于 Reducer 的拆分。你只要定义各个子 Reducer 函数，然后用这个方法，将它们合成一个大的 Reducer。
// const { combineReducers } = Redux;


// reduce方法有两个参数，第一个参数是一个callback，用于针对数组项的操作；
// 第二个参数则是传入的初始值，这个初始值用于单个数组项的操作。
// 需要注意的是，reduce方法返回值并不是数组，而是形如初始值的经过叠加处理后的操作。
// reduce函数的返回结果类型和传入的初始值相同
// reduce对数组中的所有元素调用指定的回调函数。该回调函数的返回值为累积结果，并且此返回值在下一次调用该回调函数时作为参数提供。
const combineReducers = (reducers) => {
	debugger;
	return (state = {}, action) => {
		debugger;
		// Object.keys（obj），返回一个数组，数组里是该obj可被枚举的所有属性。
		return Object.keys(reducers).reduce(
			(nextState, key) => {
				debugger;
				nextState[key] = reducers[key](
					state[key],
					action
				);
				return nextState;
			},
			{}
		);
	};
};
const todoApp = combineReducers({
	todos,
	visibilityFliter
});
// const todoApp = (state = {}, action) => {
// 	return {
// 		todos: todos(
// 			state.todos,
// 			action
// 		),
// 		visibilityFliter: visibilityFliter(
// 			state.visibilityFliter,
// 			action
// 		)
// 	};
// };

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















