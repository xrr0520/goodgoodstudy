// react todo list example(toggling a todo)

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
		var a = store;
	var b = store.getState();
	var c = this.props;
	debugger;

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
	        		<li key={todo.id}
	        			onClick={() => {
	        				store.dispatch({
	        					type: 'TOGGLE_TODO',
	        					id: todo.id
	        				});
	        			}}
	        			style={{
	        				textDecoration:
	        					todo.completed ? 
	        						'line-through' :
	        						'none'
	        			}}>
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

store.subscribe(render); // 监听render

render();























