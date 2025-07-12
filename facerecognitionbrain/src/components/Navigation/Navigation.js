import React from 'react';

const buttonStyle = {
  background: 'rgba(255, 255, 255, 0.2)', 
  color: '#000',
  fontSize: '1rem',
  padding: '10px 20px',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: '12px',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  cursor: 'pointer',
  margin: '10px',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
  transition: 'all 0.3s ease',
};

const hoverStyle = {
  transform: 'translateY(-2px)',
  boxShadow: '0 10px 25px rgba(31, 38, 135, 0.3)',
  background: 'rgba(255, 255, 255, 0.3)',
};

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hover: null
    };
  }

  handleHover = (name) => this.setState({ hover: name });
  handleLeave = () => this.setState({ hover: null });

  render() {
    const { onRouteChange, isSignedIn } = this.props;
    const { hover } = this.state;

    return (
      <nav style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px 20px' }}>
        {isSignedIn ? (
          <button
            onClick={() => onRouteChange('signout')}
            onMouseEnter={() => this.handleHover('signout')}
            onMouseLeave={this.handleLeave}
            style={{
              ...buttonStyle,
              ...(hover === 'signout' ? hoverStyle : {})
            }}
          >
            Sign Out
          </button>
        ) : (
          <>
            <button
              onClick={() => onRouteChange('signin')}
              onMouseEnter={() => this.handleHover('signin')}
              onMouseLeave={this.handleLeave}
              style={{
                ...buttonStyle,
                ...(hover === 'signin' ? hoverStyle : {})
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => onRouteChange('register')}
              onMouseEnter={() => this.handleHover('register')}
              onMouseLeave={this.handleLeave}
              style={{
                ...buttonStyle,
                ...(hover === 'register' ? hoverStyle : {})
              }}
            >
              Register
            </button>
          </>
        )}
      </nav>
    );
  }
}

export default Navigation;
