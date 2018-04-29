import React, {Component} from 'react';
import PubSub from 'pubsub-js';
import $ from 'jquery';
import {browserHistory} from 'react-router';

class FormularioFichaTreino extends Component {
    constructor(props) {
        super(props);

        this.state = {
            usuario: '',
            atividades: [],
            msgSucesso: '',
            msgErro: ''
        };

        this.baseState = this.state;

        this.handleInputChange = this.handleInputChange.bind(this);
        this.enviaForm = this.enviaForm.bind(this);
        this.resetForm = this.resetForm.bind(this);
    }

    componentDidMount() {
        $('#usuario').on('change', function (event) {
            this.setState({usuario: event.target.value});
        }.bind(this));

        $('#usuario').material_select();

        $('#atividades').on('change', function (event) {
            this.setState({atividades: [...event.target.options].filter(o => o.selected).map(o => o.value)});
        }.bind(this));

        $('#atividades').material_select();
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

    enviaForm(event) {
        event.preventDefault();

        const requestInfo = {
            method: 'POST',
            body: JSON.stringify({usuario: this.state.usuario, atividades: this.state.atividades}),
            headers: new Headers({
                'Content-type': 'application/json',
                'Authorization': `${localStorage.getItem('auth-token')}`,
            })
        };

        fetch(`http://localhost:8080/fichastreino`, requestInfo)
            .then(response => {
                if (response.ok) {
                    this.resetForm();
                    this.setState({msgSucesso: 'Ficha de treino salva com sucesso.'});
                    return response.json();
                } else {
                    throw new Error("Não foi possível realizar o cadastro.");
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
                            <select id="usuario" name="usuario" value={this.state.clientes}
                                    onChange={this.handleInputChange}>
                                {
                                    this.props.clientes.map(function (cliente) {
                                        return (
                                            <option key={cliente._links.self.href}
                                                    value={cliente._links.self.href}>{cliente.nome}</option>
                                        )
                                    })
                                }
                            </select>
                            <label htmlFor="usuario">Cliente</label>
                        </div>

                        <div className="input-field col s6">
                            <select id="atividades" name="atividades" value={this.state.atividades}
                                    onChange={this.handleInputChange}>
                                {
                                    this.props.atividades.map(function (atividade) {
                                        return (
                                            <option key={atividade._links.self.href}
                                                    value={atividade._links.self.href}>{atividade.descricao}</option>
                                        )
                                    })
                                }
                            </select>
                            <label htmlFor="atividades">Atividades</label>
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

// class TabelaPlanos extends Component {
//
//     constructor(props) {
//         super(props);
//
//         this.removePlano = this.removePlano.bind(this);
//     }
//
//     removePlano(plano) {
//         const requestInfo = {
//             method: 'DELETE',
//             headers: new Headers({
//                 'Content-type': 'application/json',
//                 'Authorization': `${localStorage.getItem('auth-token')}`,
//             })
//         };
//
//         fetch(`${plano._links.self.href}`, requestInfo)
//             .then(response => {
//                 if (response.ok) {
//                     PubSub.publish('atualiza-lista-planos', 'asd');
//                 } else {
//                     throw new Error("Não foi possível excluir um plano.");
//                 }
//             })
//             .catch(error => {
//                 if (localStorage.getItem('auth-token')) {
//                     this.setState({msgErro: error.message})
//                 } else {
//                     browserHistory.push("/?msg=Seu tempo de login expirou");
//                 }
//             });
//     }
//
//     render() {
//         return (
//             <div className="col s12 m12 l6 offset-l3">
//                 <table className="pure-table">
//                     <thead>
//                     <tr>
//                         <th>Planos</th>
//                         <th>Forma de Pagamento</th>
//                         <th className="right-align">Ações</th>
//                     </tr>
//                     </thead>
//                     <tbody>
//                     {
//                         this.props.planos.map(function (plano) {
//                             return (
//                                 <tr key={plano._links.self.href}>
//                                     <td>{plano.descricao}</td>
//                                     <td>{plano.formaDePagamento}</td>
//                                     <td className="right-align">
//                                         <i onClick={() => this.removePlano(plano)}
//                                            className="material-icons red-text icon-delete">delete</i>
//                                     </td>
//                                 </tr>
//                             );
//                         }.bind(this))
//                     }
//                     </tbody>
//                 </table>
//             </div>
//         );
//     }
// }


export default class FichaTreinoBox extends Component {

    constructor() {
        super();
        this.state = {clientes: [], atividades: []};
    }

    componentDidMount() {
        const requestInfo = {
            method: 'GET',
            headers: new Headers({
                'Content-type': 'application/json',
                'Authorization': `${localStorage.getItem('auth-token')}`,
            })
        };
        fetch(`http://localhost:8080/users/search/findByCliente`, requestInfo)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Não foi possível buscar os clientes.");
                }
            })
            .then(body => {
                this.setState({clientes: body._embedded.users});
                $('#usuario').material_select();
            })
            .catch(error => {
                if (localStorage.getItem('auth-token')) {
                    this.setState({msgErro: error.message})
                } else {
                    browserHistory.push("/?msg=Seu tempo de login expirou");
                }
            });

        fetch(`http://localhost:8080/atividades`, requestInfo)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Não foi possível buscar as atividades.");
                }
            })
            .then(body => {
                this.setState({atividades: body._embedded.atividades});
                $('#atividades').material_select();
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
                <FormularioFichaTreino atividades={this.state.atividades} clientes={this.state.clientes}/>
                {/*<TabelaPlanos planos={this.state.planos}/>*/}
            </div>
        );
    }


}