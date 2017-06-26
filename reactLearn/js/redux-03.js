// to avoid array and object mutations with concat(),slice()
const addCounter = (list) => {
	// list.push(0);
	// return list;
	return [...list, 0];
};

const removeCounter = (list, index) => {
	// return list
	// 	.slice(0, index)
	// 	.concat(list.slice(index + 1));
	return [
		...list.slice(0, index),
		...list.slice(index + 1)
	];
};



const toggleTodo = (todo) => {
	return {
		...todo,
		completed: !todo.completed
	};
}



// reducer composition with arrays and objects
const todos = (state = [], action) => {
	switch (action.type) {
		case 'ADD_TODO':
			return [
				...state,
				{
					id: action.id,
					text: action.text,
					completed: false
				}
			];
		case 'TOGGLE_TODO':
			return state.map(todo => {
				if (todo.id !== action.id) {
					return todo;
				}

				return {
					...todo,
					completed: !todo.completed
				};
			});
		default:
			return state;
	}
};
