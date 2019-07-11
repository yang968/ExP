import React from 'react';
import { Link, withRouter } from 'react-router-dom';

class SessionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentWillUnmount() {
    this.props.clearErrors();
  }

  handleClose(e) {
    e.preventDefault();
    this.props.clearErrors();
    this.setState({
      email: "",
      password: ""
    });
  }

  update(field) {
    return e => this.setState({
      [field]: e.currentTarget.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const user = Object.assign({}, this.state);
    this.props.processForm(user).then((obj) => {
      if (obj.payload) {
        window.localStorage.currentUser = JSON.stringify(obj.payload.currentUser)
        window.localStorage.token = obj.payload.currentUser.token;
      }
    });
  }

  render() {
    return (
      <div className="modal">
        <div className="modal-overlay"></div>
        <div className="login-form-container modal-form animated bounceInDown">
          <span className="modal-close js-modal-close" onClick={this.handleClose}>&times;</span>
          <form onSubmit={this.handleSubmit} className="login-form-box">
            <br />
            <h1>Sign in</h1>
            <h3>or <Link to="/contact" className="js-modal-close">contact us</Link> to create an account</h3>
            <div className="login-form">
              <label>Email
              <br />
                <input type="text"
                  value={this.state.email}
                  placeholder="e.g. tony.stark@starkindustries.com"
                  className="login-input"
                  onChange={this.update('email')}
                  />
              </label>
              <br />
              <label>Password
                <br />
                <input type="password"
                  value={this.state.password}
                  onChange={this.update('password')}
                  className="login-input"
                  placeholder="e.g. ••••••••"
                  />
              </label>
              <br />
              <ul>
                { this.props.errors && this.props.errors.map((error, idx) => (<li className="session-form-error animated fadeInDown" key={idx}>{error}</li>)) }
              </ul>
              <input 
                className={"session-button " + 
                  this.state.email && this.state.password ? "form-submit-enabled" : "form-submit-disabled"}
                type="submit"
                value="Sign in"
                disabled={!(this.state.email && this.state.password)}
                />
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(SessionForm);
