const counter = (state = 0, action) => {
	switch (action.type) {
		case 'INCREMENT':
			return state + 1;
		case 'DECREMENT':
			return state - 1;
		default:
			return state;
	}
};

const { createStore } = Redux;
const store = createStore(counter); // 返回几个公共方法 dispatch|getState|subscribe

// console.log(store.getState());
// store.dispatch({type: 'INCREMENT'});
// console.log(store.getState());

const render = () => {
	document.getElementById('root').innerHTML = store.getState();
};

store.subscribe(render);
render();

document.addEventListener('click', () => {
	store.dispatch({type: 'INCREMENT'});
});