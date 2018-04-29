import React, {Component} from 'react';
import PubSub from 'pubsub-js';
import $ from 'jquery';
import {browserHistory} from 'react-router';

class FormularioPlanos extends Component {
    constructor(props) {
        super(props);

        this.state = {
            descricao: '',
            formaDePagamento: 'mensal',
            msgSucesso: '',
            msgErro: ''
        };

        this.baseState = this.state;

        this.handleInputChange = this.handleInputChange.bind(this);
        this.enviaForm = this.enviaForm.bind(this);
        this.resetForm = this.resetForm.bind(this);
        this.isPlanoValido = this.isPlanoValido.bind(this);
    }

    componentDidMount() {
        $('#formaDePagamento').on('change', function (event) {
            this.setState({formaDePagamento: event.target.value});
        }.bind(this));

        $('#formaDePagamento').material_select();
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

    isPlanoValido(planoNova) {
        let planoFound = this.props.planos.find(plano => plano.descricao === planoNova);
        return planoFound === undefined;
    }

    enviaForm(event) {
        event.preventDefault();

        let isPlanoValido = this.isPlanoValido(this.state.descricao);
        if (!isPlanoValido) {
            this.setState({msgErro: "O plano já existe."});
            return;
        }

        const requestInfo = {
            method: 'POST',
            body: JSON.stringify({descricao: this.state.descricao, formaDePagamento: this.state.formaDePagamento}),
            headers: new Headers({
                'Content-type': 'application/json',
                'Authorization': `${localStorage.getItem('auth-token')}`,
            })
        };

        fetch(`http://localhost:8080/planos`, requestInfo)
            .then(response => {
                if (response.ok) {
                    this.resetForm();
                    this.setState({msgSucesso: 'Plano salva com sucesso.'});
                    return response.json();
                } else {
                    throw new Error("Não foi possível realizar o cadastro.");
                }
            })
            .then(body => {
                PubSub.publish('atualiza-lista-planos', body);
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

                        <div className="input-field col s6">
                            <select id="formaDePagamento" name="formaDePagamento" value={this.state.formaDePagamento}
                                    onChange={this.handleInputChange} required>
                                <option value="mensal">Mensal</option>
                                <option value="semestral">Semestral</option>
                                <option value="anual">Anual</option>
                            </select>

                            <label htmlFor="formaDePagamento">Forma de Pagamento</label>
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

class TabelaPlanos extends Component {

    constructor(props) {
        super(props);

        this.removePlano = this.removePlano.bind(this);
    }

    removePlano(plano) {
        const requestInfo = {
            method: 'DELETE',
            headers: new Headers({
                'Content-type': 'application/json',
                'Authorization': `${localStorage.getItem('auth-token')}`,
            })
        };

        fetch(`${plano._links.self.href}`, requestInfo)
            .then(response => {
                if (response.ok) {
                    PubSub.publish('atualiza-lista-planos', 'asd');
                } else {
                    throw new Error("Não foi possível excluir um plano.");
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
                        <th>Planos</th>
                        <th>Forma de Pagamento</th>
                        <th className="right-align">Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        this.props.planos.map(function (plano) {
                            return (
                                <tr key={plano._links.self.href}>
                                    <td>{plano.descricao}</td>
                                    <td>{plano.formaDePagamento}</td>
                                    <td className="right-align">
                                        <i onClick={() => this.removePlano(plano)}
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


export default class PlanosBox extends Component {

    constructor() {
        super();
        this.state = {planos: []};
    }

    componentDidMount() {
        const requestInfo = {
            method: 'GET',
            headers: new Headers({
                'Content-type': 'application/json',
                'Authorization': `${localStorage.getItem('auth-token')}`,
            })
        };
        fetch(`http://localhost:8080/planos`, requestInfo)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Não foi possível buscar os planos.");
                }
            })
            .then(body => {
                this.setState({planos: body._embedded.planos});
            });

        PubSub.subscribe('atualiza-lista-planos', function (topico, novoPlano) {
            fetch(`http://localhost:8080/planos`, requestInfo)
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error("Não foi possível buscar os planos.");
                    }
                })
                .then(body => {
                    this.setState({planos: body._embedded.planos});
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
                <FormularioPlanos planos={this.state.planos}/>
                <TabelaPlanos planos={this.state.planos}/>
            </div>
        );
    }


}