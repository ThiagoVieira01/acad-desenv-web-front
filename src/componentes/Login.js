import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';

export default class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {msg: this.props.location.query.msg || ''};
    }

    envia(event) {
        event.preventDefault();

        const requestInfo = {
            method: 'POST',
            headers: new Headers({
                'Content-type': 'application/json'
            })
        };

        fetch(`http://localhost:8080/login?email=${this.login.value}&senha=${this.senha.value}`, requestInfo)
            .then(response => {
                if (response.ok) {
                    let token = response.headers.get("Authorization").replace("token ", "");
                    localStorage.setItem('auth-token', token);
                    browserHistory.push("/academia");
                } else {
                    throw new Error('Não foi possível fazer o login');
                }
            })
            .catch(error => {
                this.setState({msg: error.message})
            });
    }

    render() {
        return (
            <div className="row">
                <div className="col s4 offset-s4">
                    <div className="row">
                        <div className="col s12 z-depth-4 card-panel">
                            <h3>Login</h3>
                            {
                                this.state.msg.length > 0 &&
                                <div className="card-panel red lighten-1">
                                    <span className="white-text">{this.state.msg}</span>
                                </div>
                            }
                            <form onSubmit={this.envia.bind(this)}>
                                <div className="row">
                                    <div className="input-field col s12">
                                        <input type="text" ref={input => this.login = input}/>
                                        <label>E-mail</label>
                                    </div>
                                </div>
                                <div className="row ">
                                    <div className="input-field col s12">
                                        <input type="password" ref={input => this.senha = input}/>
                                        <label>Senha</label>
                                    </div>
                                </div>
                                <div className="row">
                                    <button className="col s12 btn waves-effect waves-light" type="submit">Login
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};