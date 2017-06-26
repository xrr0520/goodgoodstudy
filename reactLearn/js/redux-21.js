// extrating action creators
// 把action 抽取出来 作为参数传给dispatch 有利于复用action

const { Component } = React;
const { Provider, connect } = ReactRedux;


/****** state ********/
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


/****** action *******/
let nextTodoId = 0;
const addTodo = (text) => {
	return {
		type: 'ADD_TODO',
		id: nextTodoId++,
		text
	};
};
const setVisibilityFilter = (filter) => {
	return {
		type: 'SET_VISIBILITY_FILTER',
		filter
	};
};
const toggleTodo = (id) => {
	return {
		type: 'TOGGLE_TODO',
		id
	};
}


const visibilityFilter = (
	filter = 'SHOW_ALL',
	action
) => {
	switch (action.type) {
		case 'SET_VISIBILITY_FILTER':
			return action.filter;
		default:
			return filter;
	}
};

// 用于 Reducer 的拆分。你只要定义各个子 Reducer 函数，然后用这个方法，将它们合成一个大的 Reducer。
const { combineReducers } = Redux;
const todoApp = combineReducers({
	todos,
	visibilityFilter
});


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


/********* addTodo **********/
let AddTodo = ({ dispatch }) => {
	let input;

	return (
		<div>
			<input ref={node => {
				input = node;
			}} />
			<button onClick={() => {
	        	dispatch(addTodo(input.value));
				input.value='';
			}}>
			Add Todo
			</button>
		</div>
	);
};
AddTodo = connect()(AddTodo);



/********** todoList ***********/
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


const mapStateToTodoListProps = (state) => {
	return {
		todos: getVisibleTodos(
			state.todos,
			state.visibilityFilter
		)
	};
};
const mapDispatchToTodoListProps = (dispatch) => {
	return {
		onTodoClick: (id) => {
			dispatch(toggleTodo(id));
		}
	};
};
// import { connect } from 'react-redux';
const VisibleTodoList = connect(
	mapStateToTodoListProps,
	mapDispatchToTodoListProps
)(TodoList);



 
/***** footer *****/
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

const mapStateToLinkProps = (
	state,
	ownProps
) => {
	return {
		active: ownProps.filter === state.visibilityFilter
	};
};
const mapDispatchToLinkProps = (
	dispatch,
	ownProps
) => {
	return {
		onClick: () => {
			dispatch(setVisibilityFilter(ownProps.filter));
		}
	};
};
const FilterLink = connect(
	mapDispatchToLinkProps,
	mapDispatchToLinkProps
)(Link);
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


const TodoApp = () => (
	<div>
        <AddTodo />
        <VisibleTodoList />
        <Footer />         
    </div>
);


const { createStore } = Redux;


ReactDOM.render(
	<Provider store={createStore(todoApp)}>
		<TodoApp />
	</Provider>,
	document.getElementById('root')
);







