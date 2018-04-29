import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import $ from 'jquery';
import 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';

class FormularioFuncionario extends Component {
    constructor(props) {
        super(props);

        this.state = {
            usuario: '',
            funcao: 'personalTrainer',
            cargaHorarioMensal: '1',
            grauInstrucao: 'superiorIncompleto',
            valorHora: '1',
            salario: '1',
            observacao: '',
            msgSucesso: '',
            msgErro: '',
            isFuncionarioCadastrado: false,
            idFuncionarioCadastrado: ''
        };

        this.baseState = this.state;

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleInputChangeSalario = this.handleInputChangeSalario.bind(this);
        this.enviaForm = this.enviaForm.bind(this);
        this.resetForm = this.resetForm.bind(this);
        this.formSubmitInfo = this.formSubmitInfo.bind(this);
        this.preencheDadosFuncionarioCadastrado = this.preencheDadosFuncionarioCadastrado.bind(this);
    }

    componentDidMount() {
        $('#usuario').on('change', function (event) {
            this.setState({usuario: event.target.value});
            this.preencheDadosFuncionarioCadastrado();
        }.bind(this));

        $('#funcao').on('change', function (event) {
            this.setState({funcao: event.target.value});
        }.bind(this));

        $('#grauInstrucao').on('change', function (event) {
            this.setState({grauInstrucao: event.target.value});
        }.bind(this));

        $('#usuario').material_select();
        $('#funcao').material_select();
        $('#grauInstrucao').material_select();
    }

    preencheDadosFuncionarioCadastrado() {
        let idUsuario = $('#usuario').find(":selected").data('id-usuario');
        let funcionarioCadastrado = this.props.funcionariosCadastrados.filter(funcionario =>
            funcionario.usuario.id === idUsuario
        );

        if (funcionarioCadastrado.length > 0) {
            funcionarioCadastrado = Array.isArray(funcionarioCadastrado) ? funcionarioCadastrado[0] : funcionarioCadastrado;

            this.setState({
                funcao: funcionarioCadastrado.funcao,
                cargaHorarioMensal: funcionarioCadastrado.cargaHorarioMensal,
                grauInstrucao: funcionarioCadastrado.grauInstrucao,
                valorHora: funcionarioCadastrado.valorHora,
                salario: funcionarioCadastrado.salario,
                observacao: funcionarioCadastrado.observacao,
                isFuncionarioCadastrado: true,
                idFuncionarioCadastrado: funcionarioCadastrado.id
            });
        } else {
            this.setState({isFuncionarioCadastrado: false, idFuncionarioCadastrado: ''});
            this.resetForm();
        }

        $('#funcao').material_select();
        $('#grauInstrucao').material_select();
    }

    resetForm() {
        this.setState(this.baseState);
    }

    formSubmitInfo() {
        let data = {
            usuario: this.state.usuario,
            funcao: this.state.funcao,
            cargaHorarioMensal: this.state.cargaHorarioMensal,
            grauInstrucao: this.state.grauInstrucao,
            valorHora: this.state.valorHora,
            salario: this.state.salario,
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

    handleInputChangeSalario(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });

        if (name === 'cargaHorarioMensal') {
            this.setState({salario: parseFloat(value) * parseFloat(this.state.valorHora)});
        }

        if (name === 'valorHora') {
            this.setState({salario: parseFloat(this.state.cargaHorarioMensal) * parseFloat(value)});
        }
    }

    enviaForm(event) {
        event.preventDefault();

        const requestInfo = {
            method: this.state.isFuncionarioCadastrado ? 'PUT' : 'POST',
            body: JSON.stringify(this.formSubmitInfo()),
            headers: new Headers({
                'Content-type': 'application/json',
                'Authorization': `${localStorage.getItem('auth-token')}`,
            })
        };

        let urlFetch = this.state.isFuncionarioCadastrado ?
            `http://localhost:8080/funcionarios/${this.state.idFuncionarioCadastrado}` : 'http://localhost:8080/funcionarios';
        fetch(urlFetch, requestInfo)
            .then(response => {
                if (response.ok) {
                    this.resetForm();
                    this.setState({msgSucesso: 'Funcionário salvo com sucesso.'});
                    return response.json();
                } else {
                    throw new Error("Não foi possível realizar o cadastro do funcionário.");
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
                                    this.props.userFuncionarios.map(function (userFuncionario) {
                                        return (
                                            <option key={`http://localhost:8080/users/${userFuncionario.id}`}
                                                    value={`http://localhost:8080/users/${userFuncionario.id}`}
                                                    data-id-usuario={userFuncionario.id}>{userFuncionario.nome}</option>
                                        )
                                    })
                                }
                            </select>
                            <label htmlFor="usuario">Usuário</label>


                        </div>
                        <div className="input-field col s6">
                            <select id="funcao" name="funcao" value={this.state.funcao}
                                    onChange={this.handleInputChange} required>
                                <option value="personalTrainer">Personal Trainer</option>
                                <option value="instrutor">Instrutor</option>
                            </select>
                            <label htmlFor="funcao">Função</label>
                        </div>
                    </div>

                    <div className="row">
                        <div className="input-field col s6">
                            <input id="cargaHorarioMensal" name="cargaHorarioMensal" type="number"
                                   value={this.state.cargaHorarioMensal}
                                   onInput={this.handleInputChangeSalario} required/>
                            <label htmlFor="cargaHorarioMensal" className="active">Carga Horário Mensal</label>
                        </div>

                        <div className="input-field col s6">
                            <select id="grauInstrucao" name="grauInstrucao" value={this.state.grauInstrucao}
                                    onChange={this.handleInputChange} required>
                                <option value="superiorIncompleto">Superior Incompleto</option>
                                <option value="superiorCompleto">Superior Completo</option>
                                <option value="mestre">Mestre</option>
                                <option value="doutor">Doutor</option>
                            </select>

                            <label htmlFor="grauInstrucao">Grau de Instrução</label>
                        </div>
                    </div>

                    <div className="row">
                        <div className="input-field col s6">
                            <input id="valorHora" name="valorHora" type="number"
                                   value={this.state.valorHora}
                                   onInput={this.handleInputChangeSalario} required/>
                            <label htmlFor="valorHora" className="active">Valor Hora</label>
                        </div>


                        <div className="input-field col s6">
                            <input id="salario" name="salario" type="number"
                                   value={this.state.salario}
                                   disabled/>
                            <label htmlFor="salario" className="active">Salário</label>
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


export default class FuncionarioBox extends Component {

    constructor() {
        super();
        this.state = {userFuncionarios: [], funcionariosCadastrados: []};
    }

    componentDidMount() {
        const requestInfo = {
            method: 'GET',
            headers: new Headers({
                'Content-type': 'application/json',
                'Authorization': `${localStorage.getItem('auth-token')}`,
            })
        };
        fetch(`http://localhost:8080/api/usersFuncionario`, requestInfo)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Não foi possível buscar os usuários funcionários.");
                }
            })
            .then(body => {
                this.setState({userFuncionarios: body});
                $('#usuario').material_select();
            })
            .catch(error => {
                if (localStorage.getItem('auth-token')) {
                    this.setState({msgErro: error.message})
                } else {
                    browserHistory.push("/?msg=Seu tempo de login expirou");
                }
            });

        fetch(`http://localhost:8080/api/funcionarios`, requestInfo)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Não foi possível buscar os funcionários cadastrados.");
                }
            })
            .then(body => {
                this.setState({funcionariosCadastrados: body});
                console.log(body);
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
                <FormularioFuncionario userFuncionarios={this.state.userFuncionarios}
                                       funcionariosCadastrados={this.state.funcionariosCadastrados}/>
                {/*<TabelaRestricoes restricoes={this.state.restricoes}/>*/}
            </div>
        );
    }


}