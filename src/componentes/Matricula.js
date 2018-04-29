import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import $ from 'jquery';
import 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';

class FormularioMatricula extends Component {
    constructor(props) {
        super(props);

        this.state = {
            usuario: '',
            servicoContratado: '',
            planoPagamento: '',
            formaPagamento: '',
            observacao: '',
            msgSucesso: '',
            msgErro: ''
        };

        this.baseState = this.state;

        this.handleInputChange = this.handleInputChange.bind(this);
        this.enviaForm = this.enviaForm.bind(this);
        this.resetForm = this.resetForm.bind(this);
        this.formSubmitInfo = this.formSubmitInfo.bind(this);
    }

    componentDidMount() {
        $('#usuario').on('change', function (event) {
            this.setState({usuario: event.target.value});
        }.bind(this));

        $('#servicoContratado').on('change', function (event) {
            this.setState({servicoContratado: event.target.value});
        }.bind(this));

        $('#formaPagamento').on('change', function (event) {
            this.setState({formaPagamento: event.target.value});
        }.bind(this));

        $('#planoPagamento').on('change', function (event) {
            this.setState({planoPagamento: event.target.value});
        }.bind(this));

        $('#usuario').material_select();
        $('#servicoContratado').material_select();
        $('#formaPagamento').material_select();
        $('#planoPagamento').material_select();
    }

    resetForm() {
        this.setState(this.baseState);
    }

    formSubmitInfo() {
        let data = {
            usuario: this.state.usuario,
            servicoContratado: this.state.servicoContratado,
            planoPagamento: this.state.planoPagamento,
            formaPagamento: this.state.formaPagamento,
            observacao: this.state.observacao
        };

        return data;
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
            body: JSON.stringify(this.formSubmitInfo()),
            headers: new Headers({
                'Content-type': 'application/json',
                'Authorization': `${localStorage.getItem('auth-token')}`,
            })
        };

        fetch(`http://localhost:8080/matriculas`, requestInfo)
            .then(response => {
                if (response.ok) {
                    this.resetForm();
                    this.setState({msgSucesso: 'Matrícula salva com sucesso.'});
                    return response.json();
                } else {
                    throw new Error("Não foi possível realizar o cadastro da matrícula.");
                }
            })
            // .then(body => {
            //     PubSub.publish('atualiza-lista-restricoes', body);
            // })
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
                            <select id="usuario" name="usuario" value={this.state.usuario}
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
                            <label htmlFor="usuario">Usuário</label>


                        </div>
                        <div className="input-field col s6">
                            <select id="servicoContratado" name="servicoContratado" value={this.state.servicoContratado}
                                    onChange={this.handleInputChange} required>
                                <option value="musculacao">Musculação</option>
                                <option value="perdaPeso">Perda de peso</option>
                            </select>
                            <label htmlFor="servicoContratado">Serviço Contratado</label>
                        </div>
                    </div>

                    <div className="row">
                        <div className="input-field col s6">
                            <select id="planoPagamento" name="planoPagamento" value={this.state.planoPagamento}
                                    onChange={this.handleInputChange} required>

                                {
                                    this.props.planos.map(function (plano) {
                                        return (
                                            <option key={plano._links.self.href}
                                                    value={plano._links.self.href}>{plano.descricao} - {plano.formaDePagamento}</option>
                                        )
                                    })
                                }
                            </select>

                            <label htmlFor="planoPagamento">Plano de Pagamento</label>
                        </div>
                        <div className="input-field col s6">
                            <select id="formaPagamento" name="formaPagamento" value={this.state.formaPagamento}
                                    onChange={this.handleInputChange} required>
                                <option value="dinheiro">Dinheiro</option>
                                <option value="cartaoCredito">Cartão de crédito</option>
                                <option value="debitoOnline">Débito online</option>
                            </select>

                            <label htmlFor="formaPagamento">Forma de Pagamento</label>
                        </div>
                    </div>

                    <div className="row">
                        <div className="input-field col s12">
                            <textarea id="observacao" name="observacao" type="text"
                                      value={this.state.observacao} className="materialize-textarea"
                                      onChange={this.handleInputChange}/>
                            <label htmlFor="observacao">Observações</label>
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

// class TabelaMatricula extends Component {
//
//     constructor(props) {
//         super(props);
//
//         this.removeRestricao = this.removeRestricao.bind(this);
//     }
//
//     removeRestricao(restricao) {
//         const requestInfo = {
//             method: 'DELETE',
//             headers: new Headers({
//                 'Content-type': 'application/json',
//                 'Authorization': `${localStorage.getItem('auth-token')}`,
//             })
//         };
//
//         fetch(`${restricao._links.self.href}`, requestInfo)
//             .then(response => {
//                 if (response.ok) {
//                     PubSub.publish('atualiza-lista-restricoes', 'asd');
//                 } else {
//                     throw new Error("Não foi possível excluir uma restrição.");
//                 }
//             })
//     }
//
//     render() {
//         return (
//             <div className="col s6 offset-s3">
//                 <table className="pure-table">
//                     <thead>
//                     <tr>
//                         <th>Restrições</th>
//                         <th className="right-align">Ações</th>
//                     </tr>
//                     </thead>
//                     <tbody>
//                     {
//                         this.props.restricoes.map(function (restricao) {
//                             return (
//                                 <tr key={restricao._links.self.href}>
//                                     <td>{restricao.descricao}</td>
//                                     <td className="right-align">
//                                         <i onClick={() => this.removeRestricao(restricao)}
//                                            className="material-icons red-text">delete</i>
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


export default class MatriculaBox extends Component {

    constructor() {
        super();
        this.state = {clientes: [], planos: []};
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
                    throw new Error("Não foi possível buscar as restrições.");
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
                $('#planoPagamento').material_select();
            })
            .catch(error => {
                if (localStorage.getItem('auth-token')) {
                    this.setState({msgErro: error.message})
                } else {
                    browserHistory.push("/?msg=Seu tempo de login expirou");
                }
            });

        // PubSub.subscribe('atualiza-lista-clientes-matricula', function (topico, novaRestricao) {
        //     fetch(`http://localhost:8080/clientes`, requestInfo)
        //         .then(response => {
        //             if (response.ok) {
        //                 return response.json();
        //             } else {
        //                 throw new Error("Não foi possível buscar as restrições.");
        //             }
        //         })
        //         .then(body => {
        //             this.setState({clientes: body._embedded.clientes});
        //         });
        // }.bind(this));
    }

    render() {
        return (
            <div>
                <FormularioMatricula clientes={this.state.clientes} planos={this.state.planos}/>
                {/*<TabelaRestricoes restricoes={this.state.restricoes}/>*/}
            </div>
        );
    }


}