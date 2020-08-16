import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import Intro from './components/Intro/Intro';
import NewUser from './components/NewUser/NewUser';
import { HashRouter, Route } from 'react-router-dom';

ReactDOM.render(
	<React.StrictMode>
		<HashRouter>
			<div className="main-container">
				{/* <Route path="/newUser" exact component={NewUser} /> */}
				<Route path="/" exact component={NewUser} />
			</div>
		</HashRouter>
	</React.StrictMode>,
	document.getElementById('root')
);