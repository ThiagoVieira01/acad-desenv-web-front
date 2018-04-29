import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import $ from 'jquery';
import 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';

class FormularioAtividade extends Component {
    constructor(props) {
        super(props);

        this.state = {
            clientes: [],
            descricao: '',
            restricoes: [],
            dia: 'segunda',
            periodo: 'manha',
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
        let that = this;

        $('.datepicker').pickadate({
            selectMonths: true, // Creates a dropdown to control month
            selectYears: 100, // Creates a dropdown of 15 years to control year,
            max: new Date(),
            format: 'yyyy-mm-dd',
            today: 'Hoje',
            clear: 'Limpar',
            close: 'Ok',
            closeOnSelect: true, // Close upon selecting a date,
            onClose: function () {
                that.setState({dataAtividade: this.get('value')});
            }
        });

        $('#clientes').on('change', function (event) {
            this.setState({clientes: [...event.target.options].filter(o => o.selected).map(o => o.value)});
        }.bind(this));

        $('#dia').on('change', function (event) {
            this.setState({dia: event.target.value});
        }.bind(this));

        $('#periodo').on('change', function (event) {
            this.setState({periodo: event.target.value});
        }.bind(this));

        $('#restricoes').on('change', function (event) {
            this.setState({restricoes: [...event.target.options].filter(o => o.selected).map(o => o.value)});
        }.bind(this));

        $('#clientes').material_select();
        $('#dia').material_select();
        $('#periodo').material_select();
        $('#restricoes').material_select();
    }

    resetForm() {
        this.setState(this.baseState);
    }

    formSubmitInfo() {
        let data = {
            clientes: this.state.clientes,
            descricao: this.state.descricao,
            restricoes: this.state.restricoes,
            dia: this.state.dia,
            periodo: this.state.periodo
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

        fetch(`http://localhost:8080/atividades`, requestInfo)
            .then(response => {
                if (response.ok) {
                    this.resetForm();
                    this.setState({msgSucesso: 'Atividade salva com sucesso.'});
                    return response.json();
                } else {
                    throw new Error("Não foi possível realizar o cadastro da atividade.");
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
                            <select id="clientes" name="clientes" value={this.state.clientes}
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
                            <label htmlFor="clientes">Cliente</label>
                        </div>

                        <div className="input-field col s6">
                            <input id="descricao" name="descricao" type="text"
                                   value={this.state.descricao} onChange={this.handleInputChange}/>
                            <label htmlFor="descricao">Descrição</label>
                        </div>
                    </div>

                    <div className="row">
                        <div className="input-field col s6">
                            <select id="dia" name="dia" value={this.state.dia}
                                    onChange={this.handleInputChange} required>
                                <option value="segunda">Segunda</option>
                                <option value="terca">Terça</option>
                                <option value="quarta">Quarta</option>
                                <option value="quinta">Quinta</option>
                                <option value="sexta">Sexta</option>
                                <option value="sabado">Sábado</option>
                            </select>
                            <label htmlFor="dia">Dia</label>
                        </div>

                        <div className="input-field col s6">
                            <select id="periodo" name="periodo" value={this.state.periodo}
                                    onChange={this.handleInputChange} required>
                                <option value="manha">Manhã</option>
                                <option value="tarde">Tarde</option>
                                <option value="noite">Noite</option>
                            </select>
                            <label htmlFor="periodo">Período</label>
                        </div>
                    </div>

                    <div className="row">
                        <div className="input-field col s6 input-field-restricoes">
                            <select id="restricoes" name="restricoes" value={this.state.restricoes}
                                    onChange={this.handleInputChange} multiple>
                                {
                                    this.props.restricoes.map(function (restricao) {
                                        return (
                                            <option key={restricao._links.self.href}
                                                    value={restricao._links.self.href}>{restricao.descricao}</option>
                                        )
                                    })
                                }
                            </select>
                            <label htmlFor="restricoes">Restrições</label>
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


export default class AtividadeBox extends Component {

    constructor() {
        super();
        this.state = {clientes: [], restricoes: []};
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
                    throw new Error("Não foi possível buscar as matrículas.");
                }
            })
            .then(body => {
                this.setState({clientes: body._embedded.users});
                $('#clientes').material_select();
            })
            .catch(error => {
                if (localStorage.getItem('auth-token')) {
                    this.setState({msgErro: error.message})
                } else {
                    browserHistory.push("/?msg=Seu tempo de login expirou");
                }
            });

        fetch(`http://localhost:8080/restricoes`, requestInfo)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Não foi possível buscar os professores.");
                }
            })
            .then(body => {
                this.setState({restricoes: body._embedded.restricoes});
                $('#restricoes').material_select();
                $('.input-field-restricoes .select-dropdown').val('');
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
                <FormularioAtividade clientes={this.state.clientes} restricoes={this.state.restricoes}/>
                {/*<TabelaRestricoes restricoes={this.state.restricoes}/>*/}
            </div>
        );
    }


}