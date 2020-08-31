import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Intro from './components/Intro/Intro';
import CreateUser from './components/CreateUser/CreateUser';
import { HashRouter, Route } from 'react-router-dom';

ReactDOM.render(
	<React.StrictMode>
		<HashRouter>
			<div className="main-container">
				<Route path="/createUser" exact component={CreateUser} />
				<Route path="/" exact component={Intro} />
			</div>
		</HashRouter>
	</React.StrictMode>,
	document.getElementById('root')
);