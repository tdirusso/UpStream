import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import CreateUser from './components/CreateUser/CreateUser';
import { BrowserRouter, Route } from "react-router-dom";

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<div className="App">
				<Route path="/" exact component={CreateUser} />
			</div>
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById('root')
);