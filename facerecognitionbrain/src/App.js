import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Register from './components/Register/Register';
import Rank from './components/Rank/Rank';
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import './App.css';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';

const API_BASE_URL = 'https://smartbrainbackend-x9af.onrender.com';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      init: false,
      input: '',
      imageUrl: '',
      box: [],  
      route: 'signin', 
      isSignedIn: false,
      detectError: '',       
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0, 
        joined: ''
      }
    };
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries, 
        joined: data.joined
      }
    });
  }

  async componentDidMount() {
    const initParticles = async (engine) => {
      await loadSlim(engine);
    };

    const { initParticlesEngine } = await import("@tsparticles/react");
    await initParticlesEngine(initParticles);
    this.setState({ init: true });
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  calculateFaceLocations = (data) => {
    if (!data.outputs || !data.outputs[0].data.regions) return [];
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    
    return data.outputs[0].data.regions.map(region => {
      const boundingBox = region.region_info.bounding_box;
      return {
        leftCol: boundingBox.left_col * width,
        topRow: boundingBox.top_row * height,
        rightCol: width - (boundingBox.right_col * width),
        bottomRow: height - (boundingBox.bottom_row * height),
      };
    });
  };

  displayFaceBox = (boxes) => {
    this.setState({ box: boxes });
  };

  onButtonSubmit = () => {
    if (!this.state.input.trim()) {
      this.setState({ detectError: 'Please enter a valid image URL before detecting.' });
      return;
    }

    this.setState({ imageUrl: this.state.input, detectError: '' });

    fetch(`${API_BASE_URL}/imageurl`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: this.state.input
      })
    })
    .then(response => response.json())
    .then(response => {
      if (response.outputs) {
        fetch(`${API_BASE_URL}/image`, {
          method: 'put',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(prevState => ({
            user: {
              ...prevState.user,
              entries: Number(count.entries ?? count)
            }
          }));
        })
        .catch(console.log);

        const boxes = this.calculateFaceLocations(response);
        this.displayFaceBox(boxes);
      }
    })
    .catch(err => console.log(err));
  };

  onRouteChange = (route) => {
    if(route === 'signout') {
      this.setState({
        isSignedIn: false, 
        user: {
          id: '',
          name: '',
          email: '',
          entries: 0,
          joined: ''
        },
        route: 'signin',
        imageUrl: '',
        input: '',
        box: [],
        detectError: '',
      });
    } else if(route === 'home') {
      this.setState({ route: route, isSignedIn: true });
    } else {
      this.setState({ route: route });
    }
  }

  render() {
    const { isSignedIn, imageUrl, route, box, detectError } = this.state;
    return (
      <div className="App">
        {this.state.init && (
          <Particles className="particles"
            id="tsparticles"
            options={{
              background: { color: { value: "transparent" }},
              fpsLimit: 120,
              interactivity: {
                events: { onClick: { enable: true, mode: "push" }, onHover: { enable: true, mode: "repulse" }, resize: true },
                modes: { push: { quantity: 4 }, repulse: { distance: 200, duration: 0.4 }}
              },
              particles: {
                color: { value: "#ffffff" },
                links: { color: "#ffffff", distance: 150, enable: true, opacity: 0.5, width: 1 },
                move: { direction: "none", enable: true, outModes: { default: "bounce" }, random: false, speed: 2, straight: false },
                number: { density: { enable: true, area: 800 }, value: 200 },
                opacity: { value: 0.5 },
                shape: { type: "image", image: { src: "https://craftkreatively.com/cdn/shop/files/412152fa-fa1c-5994-b289-f115f30df93e.jpg?v=1710446922&width=2363", width: 32, height: 32 }},
                size: { value: { min: 1, max: 5 } }
              },
              detectRetina: true,
            }}
          />
        )}
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === 'home' ? 
          <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries}/>
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
            <FaceRecognition imageUrl={imageUrl} box={box} error={detectError} />
          </div>
          : (
            route === 'signin' 
            ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/> 
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          )
        }
      </div>
    );
  }
}

export default App;
