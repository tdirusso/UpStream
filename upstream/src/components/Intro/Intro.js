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
		const container = this.container.current;
		const title = this.animatedTitle.current;
		const horizLine = this.horizontalLine.current;
		const vertLine = this.verticalLine.current;

		title.addEventListener('animationend', () => {
			horizLine.addEventListener('transitionend', () => {
				horizLine.classList.remove('show-arrow');

				const introDone = () => {
					vertLine.removeEventListener('transitionend', introDone);
					vertLine.classList.add('show-arrow');
					container.classList.add('animate__animated', 'animate__fadeOut', 'animate__delay-1s', 'animate__faster');
					ipcRenderer.send('intro:done');
				};

				vertLine.addEventListener('transitionend', introDone);
				vertLine.classList.add('grow');
			});

			horizLine.classList.add('grow');
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