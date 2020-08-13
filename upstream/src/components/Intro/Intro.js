import React from 'react';
import './Intro.css';
const { ipcRenderer } = window.require('electron');

export default class Intro extends React.Component {

	constructor() {
		super();
		this.horizontalLine = React.createRef();
		this.verticalLine = React.createRef();
		this.animatedTitle = React.createRef();
		this.container = React.createRef();
	}

	componentDidMount() {
		this.animatedTitle.current.addEventListener('animationend', () => {
			const horizontalLine = this.horizontalLine.current;

			horizontalLine.addEventListener('transitionend', () => {
				horizontalLine.classList.remove('show-arrow');
				const verticalLine = this.verticalLine.current;

				let sentDoneIPC = false;
				verticalLine.addEventListener('transitionend', () => {
					verticalLine.classList.add('show-arrow');
					this.container.current.classList.add('animate__animated', 'animate__fadeOut', 'animate__delay-3s', 'animate__faster');
					if (!sentDoneIPC) {
						sentDoneIPC = true;
						ipcRenderer.send('intro:done');
					}
				});

				verticalLine.classList.add('grow');
			});

			horizontalLine.classList.add('grow');
		});
	}

	render() {
		return (
			<div>
				<div className="intro-container" ref={this.container}>
					<div className="title-container">
						<div ref={this.animatedTitle} className="text-container animate__animated animate__fadeInDown animate__delay-1s">
							<h1 className="title"><span className="up-span">Up</span><span className="stream-span">Stream</span></h1>
						</div>
						<div className="horizontal-line" ref={this.horizontalLine}></div>
						<div className="vertical-line" ref={this.verticalLine}></div>
					</div>
				</div>
			</div>
		);
	}
}