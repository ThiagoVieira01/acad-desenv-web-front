import React, {Component} from 'react';
import $ from 'jquery';
import {browserHistory} from 'react-router';
import 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';
import Inputmask from "inputmask";

class CadastroFormulario extends Component {

    constructor(props) {
        super(props);

        this.state = {
            nome: '',
            dataNasc: '',
            cpf: '',
            endereco: '',
            estado: '',
            cidade: '',
            cep: '',
            email: '',
            telefone: '',
            senha: '',
            tipoCadastro: 'cliente',
            restricoes: [],
            msgErro: '',
            msgSucesso: ''
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
                that.setState({dataNasc: this.get('value')});
            }
        });

        $('#tipoCadastro').on('change', function (event) {
            this.setState({tipoCadastro: event.target.value});
        }.bind(this));

        $('#estado').on('change', function (event) {
            this.setState({estado: event.target.value});
        }.bind(this));

        $('#restricoes').on('change', function (event) {
            this.setState({restricoes: [...event.target.options].filter(o => o.selected).map(o => o.value)});
        }.bind(this));

        $('#tipoCadastro').material_select();
        $('#estado').material_select();
    }

    handleInputChange(event) {
        const target = event.target;
        let value = target.value;

        if (target.type === 'checkbox') {
            value = target.checked;
        }

        if (target.type === 'select-multiple') {
            value = [...target.options].filter(o => o.selected).map(o => o.value);
        }

        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    resetForm() {
        this.setState(this.baseState);
    }

    formSubmitInfo() {
        let data = {
            nome: this.state.nome,
            dataNasc: this.state.dataNasc,
            cpf: this.state.cpf,
            endereco: this.state.endereco,
            estado: this.state.estado,
            cidade: this.state.cidade,
            cep: this.state.cep,
            email: this.state.email,
            telefone: this.state.telefone,
            senha: this.state.tipoCadastro === 'cliente' ? 'null' : this.state.senha,
            tipoCadastro: this.state.tipoCadastro,
            restricoes: this.state.restricoes
        };

        return data;
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

        fetch(`http://localhost:8080/users`, requestInfo)
            .then(response => {
                if (response.ok) {
                    this.resetForm();
                    this.setState({msgSucesso: 'Cadastro realizado com sucesso.'});
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
        let maskCpf = new Inputmask("999.999.999-99");
        let maskCep = new Inputmask("99999-999");
        maskCpf.mask($('#cpf'));
        maskCep.mask($('#cep'));
        Inputmask({mask:  function () {
            return ['(99) 9999-9999', '(99) 99999-9999'];
        }, placeholder: " "}).mask($('#telefone'));

        return (
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
                        <select id="tipoCadastro" name="tipoCadastro" value={this.state.tipoCadastro}
                                onChange={this.handleInputChange}>
                            <option value="cliente">Cliente</option>
                            <option value="funcionario">Funcionário</option>
                        </select>
                        <label htmlFor="tipoCadastro">Tipo de cadastro</label>
                    </div>

                    <div className="input-field col s6">
                        <input id="nome" name="nome" type="text"
                               value={this.state.nome}
                               onChange={this.handleInputChange} required/>
                        <label htmlFor="nome">Nome Completo</label>
                    </div>

                </div>
                <div className="row">
                    <div className="input-field col s6">
                        <input id="dataNasc" name="dataNasc" type="text"
                               className="datepicker"
                               value={this.state.dataNasc}
                               onChange={this.handleInputChange} required/>
                        <label htmlFor="dataNasc">Data Nascimento</label>
                    </div>

                    <div className="input-field col s6">
                        <input id="cpf" name="cpf" type="text"
                               value={this.state.cpf}
                               onChange={this.handleInputChange} required/>
                        <label htmlFor="cpf">CPF</label>
                    </div>

                </div>
                <div className="row">
                    <div className="input-field col s4">
                        <input id="endereco" name="endereco" type="text"
                               value={this.state.endereco}
                               onChange={this.handleInputChange} required/>
                        <label htmlFor="endereco">Endereço</label>
                    </div>

                    <div className="input-field col s4">
                        <select id="estado" name="estado" value={this.state.estado}
                                onChange={this.handleInputChange} required>
                            <option value="AC">Acre</option>
                            <option value="AL">Alagoas</option>
                            <option value="AP">Amapá</option>
                            <option value="AM">Amazonas</option>
                            <option value="BA">Bahia</option>
                            <option value="CE">Ceará</option>
                            <option value="DF">Distrito Federal</option>
                            <option value="ES">Espírito Santo</option>
                            <option value="GO">Goiás</option>
                            <option value="MA">Maranhão</option>
                            <option value="MT">Mato Grosso</option>
                            <option value="MS">Mato Grosso do Sul</option>
                            <option value="MG">Minas Gerais</option>
                            <option value="PA">Pará</option>
                            <option value="PB">Paraíba</option>
                            <option value="PR">Paraná</option>
                            <option value="PE">Pernambuco</option>
                            <option value="PI">Piauí</option>
                            <option value="RJ">Rio de Janeiro</option>
                            <option value="RN">Rio Grande do Norte</option>
                            <option value="RS">Rio Grande do Sul</option>
                            <option value="RO">Rondônia</option>
                            <option value="RR">Roraima</option>
                            <option value="SC">Santa Catarina</option>
                            <option value="SP">São Paulo</option>
                            <option value="SE">Sergipe</option>
                            <option value="TO">Tocantins</option>
                        </select>
                        <label htmlFor="estado">Estado</label>
                    </div>
                    <div className="input-field col s4">
                        <input id="cidade" name="cidade" type="text"
                               value={this.state.cidade}
                               onChange={this.handleInputChange} required/>
                        <label htmlFor="cidade">Cidade</label>
                    </div>

                </div>
                <div className="row">
                    <div className="input-field col s4">
                        <input id="cep" name="cep" type="text"
                               value={this.state.cep}
                               onChange={this.handleInputChange} required/>
                        <label htmlFor="cep">Cep</label>
                    </div>

                    <div className="input-field col s4">
                        <input id="email" name="email" type="email"
                               value={this.state.email}
                               onChange={this.handleInputChange} required/>
                        <label htmlFor="email">Email</label>
                    </div>
                    <div className="input-field col s4">
                        <input id="telefone" name="telefone" type="text"
                               value={this.state.telefone}
                               onChange={this.handleInputChange} required/>
                        <label htmlFor="telefone">Telefone</label>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col s6">
                        <input id="senha" name="senha" type="password"
                               value={this.state.tipoCadastro === 'cliente' ? '' : this.state.senha}
                               onChange={this.handleInputChange} required
                               disabled={this.state.tipoCadastro === 'cliente' ? 'disabled' : ''}/>
                        <label htmlFor="senha">Senha</label>
                    </div>

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
        )
    }
}


export default class CadastroBox extends Component {

    constructor() {
        super();
        this.state = {restricoes: []};
    }

    componentDidMount() {
        const requestInfo = {
            method: 'GET',
            headers: new Headers({
                'Authorization': `${localStorage.getItem('auth-token')}`,
                'Content-type': 'application/json'
            })
        };

        fetch(`http://localhost:8080/restricoes`, requestInfo)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Token expirou");
                }
            })
            .then(data => {
                let restricoes = data._embedded.restricoes;
                this.setState({restricoes: restricoes});
                $('#restricoes').material_select();
                $('.input-field-restricoes .select-dropdown').val('');
            })
            .catch(error => {
                browserHistory.push("/");
            });
    }

    render() {
        return (
            <CadastroFormulario restricoes={this.state.restricoes}/>
        )
    }

}