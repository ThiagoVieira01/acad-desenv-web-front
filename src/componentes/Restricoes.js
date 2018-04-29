import React, {Component} from 'react';
import PubSub from 'pubsub-js';
import {browserHistory} from 'react-router';

class FormularioRestricoes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            descricao: '',
            msgSucesso: '',
            msgErro: ''
        };

        this.baseState = this.state;

        this.handleInputChange = this.handleInputChange.bind(this);
        this.enviaForm = this.enviaForm.bind(this);
        this.resetForm = this.resetForm.bind(this);
        this.isRestricaoValida = this.isRestricaoValida.bind(this);
    }

    resetForm() {
        this.setState(this.baseState);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    isRestricaoValida(restricaoNova) {
        let restricaoFound = this.props.restricoes.find(restricao => restricao.descricao === restricaoNova);
        return restricaoFound === undefined;
    }

    enviaForm(event) {
        event.preventDefault();

        let isRestricaoValida = this.isRestricaoValida(this.state.descricao);
        if (!isRestricaoValida) {
            this.setState({msgErro: "A restrição já existe."});
            return;
        }

        const requestInfo = {
            method: 'POST',
            body: JSON.stringify({descricao: this.state.descricao}),
            headers: new Headers({
                'Content-type': 'application/json',
                'Authorization': `${localStorage.getItem('auth-token')}`,
            })
        };

        fetch(`http://localhost:8080/restricoes`, requestInfo)
            .then(response => {
                if (response.ok) {
                    this.resetForm();
                    this.setState({msgSucesso: 'Restrição salva com sucesso.'});
                    return response.json();
                } else {
                    throw new Error("Não foi possível realizar o cadastro.");
                }
            })
            .then(body => {
                PubSub.publish('atualiza-lista-restricoes', body);
            })
            .catch(error => {
                if (localStorage.getItem('auth-token')) {
                    this.setState({msgErro: error.message})
                } else {
                    browserHistory.push("/?msg=Seu tempo de login expirou");
                }
            });
    }

    render() {
        return (
            <div>
                <form className="col s12 m12 l6 offset-l3" onSubmit={this.enviaForm} method="POST">
                    {
                        this.state.msgErro.length > 0 &&
                        <div className="card-panel red lighten-1">
                            <span className="white-text">{this.state.msgErro}</span>
                        </div>
                    }
                    {
                        this.state.msgSucesso.length > 0 &&
                        <div className="card-panel green lighten-1">
                            <span className="white-text">{this.state.msgSucesso}</span>
                        </div>
                    }

                    <div className="row">
                        <div className="input-field col s6">
                            <input id="descricao" name="descricao" type="text"
                                   value={this.state.descricao}
                                   onChange={this.handleInputChange} required/>
                            <label htmlFor="descricao">Descrição</label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col s12">
                            <button className="btn waves-effect waves-light" type="submit" name="action">Submit
                                <i className="material-icons right">send</i>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

class TabelaRestricoes extends Component {

    constructor(props) {
        super(props);

        this.removeRestricao = this.removeRestricao.bind(this);
    }

    removeRestricao(restricao) {
        const requestInfo = {
            method: 'DELETE',
            headers: new Headers({
                'Content-type': 'application/json',
                'Authorization': `${localStorage.getItem('auth-token')}`,
            })
        };

        fetch(`${restricao._links.self.href}`, requestInfo)
            .then(response => {
                if (response.ok) {
                    PubSub.publish('atualiza-lista-restricoes', 'asd');
                } else {
                    throw new Error("Não foi possível excluir uma restrição.");
                }
            })
            .catch(error => {
                if (localStorage.getItem('auth-token')) {
                    this.setState({msgErro: error.message})
                } else {
                    browserHistory.push("/?msg=Seu tempo de login expirou");
                }
            });
    }

    render() {
        return (
            <div className="col s12 m12 l6 offset-l3">
                <table className="pure-table">
                    <thead>
                    <tr>
                        <th>Restrições</th>
                        <th className="right-align">Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.props.restricoes.map(function (restricao) {
                            return (
                                <tr key={restricao._links.self.href}>
                                    <td>{restricao.descricao}</td>
                                    <td className="right-align">
                                        <i onClick={() => this.removeRestricao(restricao)}
                                           className="material-icons red-text icon-delete">delete</i>
                                    </td>
                                </tr>
                            );
                        }.bind(this))
                    }
                    </tbody>
                </table>
            </div>
        );
    }
}


export default class RestricoesBox extends Component {

    constructor() {
        super();
        this.state = {restricoes: []};
    }

    componentDidMount() {
        const requestInfo = {
            method: 'GET',
            headers: new Headers({
                'Content-type': 'application/json',
                'Authorization': `${localStorage.getItem('auth-token')}`,
            })
        };
        fetch(`http://localhost:8080/restricoes`, requestInfo)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Não foi possível buscar as restrições.");
                }
            })
            .then(body => {
                this.setState({restricoes: body._embedded.restricoes});
            });

        PubSub.subscribe('atualiza-lista-restricoes', function (topico, novaRestricao) {
            fetch(`http://localhost:8080/restricoes`, requestInfo)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error("Não foi possível buscar as restrições.");
                    }
                })
                .then(body => {
                    this.setState({restricoes: body._embedded.restricoes});
                })
                .catch(error => {
                    if (localStorage.getItem('auth-token')) {
                        this.setState({msgErro: error.message})
                    } else {
                        browserHistory.push("/?msg=Seu tempo de login expirou");
                    }
                });
        }.bind(this));
    }

    render() {
        return (
            <div>
                <FormularioRestricoes restricoes={this.state.restricoes}/>
                <TabelaRestricoes restricoes={this.state.restricoes}/>
            </div>
        );
    }


}