const Counter = () => {
	return (
		<div>{children}</div>
	);
}

ReactDOM.render(
        <Counter filter="abc" >Hello, world!</Counter>,
        document.getElementById('example')
      );