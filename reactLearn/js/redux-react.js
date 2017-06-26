const Counter = ({value}) => (<h1>{value}</h1>);

const render = () => {
	// document.getElementById('txt').innerHTML = store.getState();
	ReactDOM.render(
		<Counter value={store.getState()} />,
		document.getElementById('root')
	);
};