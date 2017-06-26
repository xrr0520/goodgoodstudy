// passing the store down implicitly via context

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

const visibilityFilter = (
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
	visibilityFilter
});


const { Component } = React;

// 区分active与否的表现
const Link = ({
	active,
	onClick,
	children
}) => {
	if (active) {
		return (<span>{children}</span>);
	}
	return (
		<a href='#'
	       onClick={e => {
	         e.preventDefault();
	         onClick();
	       }}
	    >
	      {children}
	    </a>
	);
};

// 传入data和behavior
class FilterLink extends Component {
	// 该组件被render之后 执行 监听
	componentDidMount() {
		// const { store } = this.props;
		const { store } = this.context;
		this.unsubscribe = store.subscribe(() => 
			this.forceUpdate()
		);
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	render() {
		const props = this.props;
		// const { store } = props;
		const { store } = this.context;
		const state = store.getState();

		return (
			<Link 
				active={props.filter === state.visibilityFilter}
				onClick={() => 
					store.dispatch({
						type: 'SET_VISIBILITY_FILTER',
						filter: props.filter
					})
				}
			>
			{props.children}
			</Link>
		);
	}
};
// 要接收父组件的context 也需要先实例化
FilterLink.contextTypes = {
	// 作用：告知使用store上下文
	store: React.PropTypes.object
};


// 此处传入store  因为FilterLink需要该值
const Footer = () => {
	return (
		<p>
		  Show:
		  {' '}
		  <FilterLink
		    filter='SHOW_ALL'
		  >
		    All
		  </FilterLink>
		  {' '}
		  <FilterLink
		    filter='SHOW_ACTIVE'
		  >
		    Active
		  </FilterLink>
		  {' '}
		  <FilterLink
		    filter='SHOW_COMPLETED'
		  >
		    Completed
		  </FilterLink>
		</p>
	);
};

const getVisibleTodos = (
	todos,
	filter
) => {
	switch (filter) {
		case 'SHOW_ALL':
			return todos;
		case 'SHOW_COMPLETED':
			return todos.filter(
				t => t.completed
			);
		case 'SHOW_ACTIVE':
			return todos.filter(
				t => !t.completed
			);
	}
};

/************************************/ 
// const AddTodo = ({ store }) => {
// 因为没有this 把{store}作为第二个参数传进来 理解会直接把context赋值给它
const AddTodo = (props, { store }) => {
	let input;

	return (
		<div>
			<input ref={node => {
				input = node;
			}} />
			<button onClick={() => {
				console.log(store.getState());
	        	store.dispatch({
	        		type: 'ADD_TODO',
	        		id: nextTodoId++,
	        		text: input.value
	        	});
				console.log(store.getState());
				input.value='';
			}}>
			Add Todo
			</button>
		</div>
	);
};
// 要接收父组件的context 也需要先实例化
AddTodo.contextTypes = {
	// 作用：告知使用store上下文
	store: React.PropTypes.object
};


const Todo = ({
	onClick,
	completed,
	text
}) => (
	<li
		onClick={onClick}
		style={{
			textDecoration:
				completed ? 
					'line-through' : 
					'none'
		}}>
		{text}
	</li>
);

const TodoList = ({
	todos,
	onTodoClick
}) => (
	<ul>
		{todos.map(todo => 
			<Todo
				key={todo.id}
				{...todo}
				onClick={() => onTodoClick(todo.id)}
			/>
		)}
	</ul>
);
/************************************/ 
// VisibleTodoList 开头首字母未大写 就不能正确执行
class VisibleTodoList extends Component {
	componentDidMount() {
		// const { store } = this.props;
		const { store } = this.context;
		this.unsubscribe = store.subscribe(() => 
			this.forceUpdate()
		);
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	render() {
		const props = this.props;
		// const { store } = props;
		const { store } = this.context;
		const state = store.getState();

		return (
			<TodoList
				todos={
					getVisibleTodos(
        				state.todos,
        				state.visibilityFilter
        			)
				}
				onTodoClick={id =>
	        		store.dispatch({
	        			type: 'TOGGLE_TODO',
	        			id
	        		})
				}
			/>
		);
	}
};
// 要接收父组件的context 也需要先实例化
VisibleTodoList.contextTypes = {
	// 作用：告知使用store上下文
	store: React.PropTypes.object
};


let nextTodoId = 0;

const TodoApp = () => (
	<div>
        <AddTodo />
        <VisibleTodoList />
        <Footer />         
    </div>
);

class Provider extends Component {
	getChildContext() {
		return {
			store: this.props.store
		};
	}

	render() {
		return this.props.children;
	}
}
// 要想使用 Provider 的上下文 必须先做此实例化 否则子组件获取不到他的上下文
Provider.childContextTypes = {
	store: React.PropTypes.object
}

const { createStore } = Redux;

// const render = () => {
	ReactDOM.render(
		<Provider store={createStore(todoApp)}>
			<TodoApp />
		</Provider>,
		document.getElementById('root')
	);
// };






















