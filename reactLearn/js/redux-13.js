// extracting container components(FilterLink) 抽取表现组件

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


const { createStore } = Redux;
// const store = createStore(todos);
const store = createStore(todoApp);

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
		this.unsubscribe = store.subscribe(() => 
			this.forceUpdate()
		);
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	render() {
		const props = this.props;
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

// const Footer = ({
// 	visibilityFilter,
// 	onFilterClick
// }) => {
// Footer 中的参数完全没有用上 只是不断下传 没有意义
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
const AddTodo = ({
	onAddClick
}) => {
	let input;

	return (
		<div>
			<input ref={node => {
				input = node;
			}} />
			<button onClick={() => {
				onAddClick(input.value);
				input.value='';
			}}>
			Add Todo
			</button>
		</div>
	);
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

let nextTodoId = 0;

const TodoApp = ({
	todos,
	visibilityFilter
}) => (
	<div>    
        <AddTodo onAddClick = {text => {
        	store.dispatch({
        		type: 'ADD_TODO',
        		id: nextTodoId++,
        		text
        	});
        }
        }/>

        <TodoList
        	todos={
        		getVisibleTodos(
        			todos,
        			visibilityFilter
        		)
        	}
        	onTodoClick={id => {
        		store.dispatch({
        			type: 'TOGGLE_TODO',
        			id
        		});
        	}
        	}
        />

        <Footer/>
            
    </div>
);


const render = () => {	
	ReactDOM.render(
		<TodoApp
	      {...store.getState()}
	    />,
		document.getElementById('root')
	);

// ...  >>>  ES7草案中的对象展开运算符
	const {todos,visibilityFilter} = {...store.getState()};
	let n = {todos,visibilityFilter};
	console.log(n);
};

store.subscribe(render); // 监听render
render();























