import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import Intro from './components/Intro/Intro';
import CreateBudget from './components/CreateBudget/CreateBudget';
import { HashRouter, Route } from 'react-router-dom';

ReactDOM.render(
	<React.StrictMode>
		<HashRouter>
			<div className="main-container">
				{/* <Route path="/createBudget" exact component={CreateBudget} /> */}
				<Route path="/" exact component={CreateBudget} />
			</div>
		</HashRouter>
	</React.StrictMode>,
	document.getElementById('root')
);