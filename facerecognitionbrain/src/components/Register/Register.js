import React from 'react';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      name: '',
      error: '' 
    };
  }

  onNameChange = (event) => {
    this.setState({ name: event.target.value, error: '' }); // clear error on change
  }

  onEmailChange = (event) => {
    this.setState({ email: event.target.value, error: '' }); // clear error on change
  }

  onPasswordChange = (event) => {
    this.setState({ password: event.target.value, error: '' }); // clear error on change
  }

 onSubmitRegister = () => {
  const { name, email, password } = this.state;

  const nameRegex = /^[a-zA-Z\s]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name.trim() || !email.trim() || !password.trim()) {
    this.setState({ error: 'Invalid input: all fields are required. Please try again.' });
    return;
  }

  if (!nameRegex.test(name)) {
    this.setState({ error: 'Name must contain letters and spaces only. No numbers or special characters allowed.' });
    return;
  }

  if (!emailRegex.test(email)) {
    this.setState({ error: 'Invalid email format. Please enter a valid email.' });
    return;
  }

  if (password.length < 4) {
    this.setState({ error: 'Password must be at least 4 characters long.' });
    return;
  }

  // ✅ Add this log
  console.log('Registering with:', {
    name,
    email,
    password
  });

  fetch('https://smartbrainbackend-x9af.onrender.com/register', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      name
    })
  })
    .then(response => response.json())
    .then(user => {
      if (user.id) {
        this.props.loadUser(user);
        this.props.onRouteChange('home');
      } else {
        this.setState({ error: 'Registration failed. Please try again.' });
      }
    })
    .catch(() => {
      this.setState({ error: 'Registration failed. Please try again later.' });
    });
}

  render() {
    const { error } = this.state;
    return (
      <article
        className="br3 mv4 w-90 w-60-m w-25-l mw6 center"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '1rem',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
        }}
      >
        <main className="pa4 black-80">
          <div className="measure">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend
                style={{
                  color: '#fff',
                  fontSize: '2.5rem',
                  fontWeight: '600',
                  textAlign: 'center',
                  marginBottom: '1rem',
                  textShadow: '0 0 8px rgba(255, 255, 255, 0.2)',
                  userSelect: 'none',
                  minHeight: '40px'
                }}
              >
                Register
              </legend>

              {error && (
                <div
                  style={{
                    color: '#ff4d4d',
                    fontWeight: '600',
                    fontSize: '1rem',
                    marginBottom: '1rem',
                    textAlign: 'center',
                    userSelect: 'none',
                    fontFamily: 'Arial, sans-serif',
                    textShadow: '0 0 4px rgba(255, 0, 0, 0.6)'
                  }}
                >
                  {error}
                </div>
              )}

              <div className="mt2">
                <label
                  className="db fw6 lh-copy f6"
                  htmlFor="name"
                  style={{ color: 'rgba(255, 255, 255, 0.9)' }}
                >
                  Name
                </label>

                <input
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  style={{
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: '#fff',
                    borderRadius: '8px',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    transition: 'border-color 0.3s ease',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }}
                  type="text"
                  name="name"
                  id="name"
                  onChange={this.onNameChange}
                  onFocus={e => (e.target.style.borderColor = '#667eea')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)')}
                />
              </div>

              <div className="mt3">
                <label
                  className="db fw6 lh-copy f6"
                  htmlFor="email-address"
                  style={{ color: 'rgba(255, 255, 255, 0.9)' }}
                >
                  Email
                </label>
                <input
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  style={{
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: '#fff',
                    borderRadius: '8px',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    transition: 'border-color 0.3s ease',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }}
                  type="email"
                  name="email-address"
                  id="email-address"
                  onChange={this.onEmailChange}
                  onFocus={e => (e.target.style.borderColor = '#667eea')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)')}
                />
              </div>

              <div className="mv3">
                <label
                  className="db fw6 lh-copy f6"
                  htmlFor="password"
                  style={{ color: 'rgba(255, 255, 255, 0.9)' }}
                >
                  Password
                </label>
                <input
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  style={{
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: '#fff',
                    borderRadius: '8px',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    transition: 'border-color 0.3s ease',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  }}
                  type="password"
                  name="password"
                  id="password"
                  onChange={this.onPasswordChange}
                  onFocus={e => (e.target.style.borderColor = '#667eea')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)')}
                />
              </div>
            </fieldset>

            <div>
              <input
                onClick={this.onSubmitRegister}
                type="submit"
                value="Register"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  color: '#fff',
                  fontSize: '1rem',
                  padding: '10px 28px',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  cursor: 'pointer',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s ease',
                  marginTop: '2px',
                  letterSpacing: '1px',
                  fontWeight: '500',
                  width: '63%',
                  userSelect: 'none',
                }}
                onMouseEnter={e => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.25)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.25)';
                }}
                onMouseLeave={e => {
                  e.target.style.transform = 'none';
                  e.target.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                }}
                onMouseDown={e => (e.target.style.transform = 'scale(0.96)')}
                onMouseUp={e => (e.target.style.transform = 'translateY(-2px)')}
              />
            </div>
          </div>
        </main>
      </article>
    );
  }
}

export default Register;
