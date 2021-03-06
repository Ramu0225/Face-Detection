import React, { Component } from "react";
import Navigation from "./components/navigation/navigation";
import SignIn from "./components/signin/signin.component";
import Register from "./components/register/register.component";
import Logo from "./components/logo/logo";
import ImageLinkForm from "./components/imagelinkform/imagelinkform";
import Rank from "./components/rank/rank";
import Particles from "react-particles-js";
import "./App.css";
import FaceDetection from "./components/face-detection/face-detection";



const particlesOptions = {
	particles: {
		number: {
			value: 30,
			density: {
				enable: true,
				value_area: 350,
			},
		},
	},
};
const initialState = {
  	input: "",
			imageUrl: "",
			box: [],
			route: "signin",
			isSignedIn: false,
    user: {
      id: "",
      name: "",
      email: "",
      entries: 0,
      joined: "",
    }
}
class App extends Component {
	constructor() {
		super();
		this.state = initialState;
	}

	loadUser = (data) => {
		this.setState({
			user: {
				id: data.id,
				name: data.name,
				email: data.email,
				entries: data.entries,
				joined: data.joined,
			},
		});
	};

	calculatedFacelocation = (data) => {
		const image = document.getElementById("inputimage");
		const width = Number(image.width);
		const height = Number(image.height);
		return data.outputs[0].data.regions.map((r) => {
			const boundingBox = r.region_info.bounding_box;
			return {
				leftCol: boundingBox.left_col * width,
				topRow: boundingBox.top_row * height,
				rightCol: width - boundingBox.right_col * width,
				bottomRow: height - boundingBox.bottom_row * height,
			};
		});
	};

	displayFaceBox = (box) => {
		this.setState({ box: box });
	};
	onInputChange = (event) => {
		this.setState({ input: event.target.value });
	};
	onButtonSubmit = () => {
		this.setState({ imageUrl: this.state.input });
		fetch("http://localhost:5000/imageurl", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				input: this.state.input,
			}),
		})
			.then((response) => response.json())
			.then((response) => {
				if (response) {
					fetch("http://localhost:5000/image", {
						method: "PUT",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							id: this.state.user.id,
						}),
					})
						.then((response) => response.json())
						.then((count) => {
							this.setState(Object.assign(this.state.user, { entries: count }));
						});
				}
				this.displayFaceBox(this.calculatedFacelocation(response));
			})
			.catch((err) => console.log(err));
	};

	onRouteChange = (route) => {
		if (route === "signout") {
			this.setState( initialState );
		} else if (route === "home") {
			this.setState({ isSignedIn: true });
		}
		this.setState({ route: route });
	};
	render() {
		const { isSignedIn, imageUrl, box, route } = this.state;
		return (
			<div className="App">
				<Particles className="particles" params={particlesOptions} />

				<Navigation
					isSignedIn={isSignedIn}
					onRouteChange={this.onRouteChange}
				/>
				{route === "home" ? (
					<div>
						<Logo />
						<div>
							<Rank
								name={this.state.user.name}
								entries={this.state.user.entries}
							/>
							<ImageLinkForm
								onButtonSubmit={this.onButtonSubmit}
								onInputChange={this.onInputChange}
							/>
							<FaceDetection box={box} imageUrl={imageUrl} />
						</div>
					</div>
				) : route === "signin" ? (
					<SignIn
						loadUser={this.loadUser}
						isSignedIn={isSignedIn}
						onRouteChange={this.onRouteChange}
					/>
				) : (
					<Register
						loadUser={this.loadUser}
						isSignedIn={isSignedIn}
						onRouteChange={this.onRouteChange}
					/>
				)}
			</div>
		);
	}
}

export default App;
