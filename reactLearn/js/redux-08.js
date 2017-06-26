// react todo list example (adding a todo)

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
const { combineReducers } = Redux;
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

const { Component } = React;

let nextTodoId = 0;
class TodoApp extends Component {
	render() {
		// const {
		// 	todos,
		// 	visibilityFilter
		// } = this.props;

		// const visibleTodos = getVisibleTodos(
		// 	todos,
		// 	visibilityFilter
		// );

		// 在react典型的数据流中，props传递是父子组件交互的唯一方式；通过传递一个新的props值来使子组件重新re-render,
	    // 从而达到父子组件通信。当然，就像react官网所描述的一样，在react典型的数据量之外，某些情况下
	    // （例如和第三方的dom库整合，或者某个dom元素focus等）为了修改子组件我们可能需要另一种方式，这就是ref方式。
	    
	    // React提供的这个ref属性，表示为对组件真正实例的引用，其实就是ReactDOM.render()返回的组件实例；
	    // 需要区分一下，ReactDOM.render()渲染组件时返回的是组件实例；而渲染dom元素时，返回是具体的dom节点。
		return (
		    <div>    
		        <input ref={node => {
		            this.input = node; //通过 把当前dom节点 赋值给this 可以在其他地方使用该节点
		        }} />
		        <button onClick = {() => {
		            store.dispatch({
		                type:'ADD_TODO',
		                text: this.input.value,
		                id: nextTodoId++
		            });
		            this.input.value = '';
		        }}>
		        Add Todo
		        </button>

		        <ul>
		        	{this.props.todos.map(todo =>
	        		<li key={todo.id}>
	        			{todo.text}
	        		</li>
	        		)}
		        </ul>		        
		    </div>
		);
	}
}

const render = () => {
	ReactDOM.render(
		<TodoApp
			// {...store.getState()}
			todos={store.getState().todos}
		/>,
		document.getElementById('root')
	);
};

store.subscribe(render);
render();























