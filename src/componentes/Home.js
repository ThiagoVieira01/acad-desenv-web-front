import React, {Component} from 'react';
import {Link} from 'react-router';

export default class Home extends Component {
    render() {
        return (
            <div>
                <div className="row">
                    <div className="col s12 m12 l6">
                        <div className="card card-dashboard z-depth-3">
                            <div className="row">
                                <div className="left card-title">
                                    <b>Cadastro</b>
                                </div>
                            </div>

                            <div className="row">
                                <Link to="/academia/cadastro">
                                    <div className="col s6 waves-effect center-align">
                                        <i className="red-text text-lighten-1 large material-icons">person</i>
                                        <span
                                            className="red-text text-lighten-1"><h5>Cliente/<br/>Funcionário</h5></span>
                                    </div>
                                </Link>

                                <Link to="/academia/restricoes">
                                    <div className="col s6 waves-effect center-align">
                                        <i className="red-text text-lighten-1 large material-icons">not_interested</i>
                                        <span className="red-text text-lighten-1"><h5>Restrições</h5></span>
                                    </div>
                                </Link>
                            </div>
                            <div className="row">
                                <Link to="/academia/fichaTreino">
                                    <div className="col s6 waves-effect center-align">
                                        <i className="red-text text-lighten-1 large material-icons">format_list_numbered</i>
                                        <span className="red-text text-lighten-1"><h5>Ficha Treino</h5></span>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="col s12 m12 l6">
                        <div className="card card-dashboard z-depth-3">
                            <div className="row">
                                <div className="left card-title">
                                    <b>Gerenciamento</b>
                                </div>
                            </div>
                            <div className="row">
                                <Link to="/academia/funcionario">
                                    <div className="col s6 waves-effect center-align">
                                        <i className="red-text text-lighten-1 large material-icons">work</i>
                                        <span className="red-text text-lighten-1"><h5>Funcionário</h5></span>
                                    </div>
                                </Link>

                                <Link to="/academia/matricula">
                                    <div className="col s6 waves-effect center-align">
                                        <i className="red-text text-lighten-1 large material-icons">assignment</i>
                                        <span className="red-text text-lighten-1"><h5>Matrícula</h5></span>
                                    </div>
                                </Link>
                            </div>

                            <div className="row">
                                <Link to="/academia/planos">
                                    <div className="col s6 waves-effect center-align">
                                        <i className="red-text text-lighten-1 large material-icons">payment</i>
                                        <span className="red-text text-lighten-1"><h5>Planos</h5></span>
                                    </div>
                                </Link>
                                <Link to="/academia/atividadeAvaliacao">
                                    <div className="col s6 waves-effect center-align">
                                        <i className="red-text text-lighten-1 large material-icons">fitness_center</i>
                                        <span
                                            className="red-text text-lighten-1"><h5>Atividades/<br/>Avaliações</h5></span>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}