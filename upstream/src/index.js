import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Intro from './components/Intro/Intro';
import CreateBudget from './components/CreateBudget/CreateBudget';
import Dashboard from './components/Dashboard/Dashboard';
import Categories from './components/Categories/Categories';
import { HashRouter, Route } from 'react-router-dom';

ReactDOM.render(
	<React.StrictMode>
		<HashRouter>
			<div className="main-container">
				<Route path="/" exact component={Intro} />
				<Route path="/createBudget" exact component={CreateBudget} />
				<Route path="/dashboard" exact component={Dashboard} />
				<Route path="/categories" exact component={Categories} />
			</div>
		</HashRouter>
	</React.StrictMode>,
	document.getElementById('root')
);