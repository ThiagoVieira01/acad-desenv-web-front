import React, {Component} from 'react';
import {Link} from 'react-router';

export default class Header extends Component {

    render() {
        return (
            <div>
                <ul id="slide-out" className="side-nav fixed z-depth-2">
                    <li className="center no-padding">
                        <div className="red lighten-1 white-text valign-wrapper title-side-nav-wrapper">
                            <span className="title-side-nav center-align">
                                Academia ABC
                            </span>
                        </div>
                    </li>

                    <li><Link to="/academia">Dashboard</Link></li>

                    <ul className="collapsible" data-collapsible="accordion">
                        <li>
                            <div className="collapsible-header waves-effect">Cadastro</div>
                            <div className="collapsible-body">
                                <ul>
                                    <li id="users_seller">
                                        <Link to="/academia/cadastro">Cliente/Funcionário</Link>
                                    </li>
                                    <li id="users_customer">
                                        <Link to="/academia/restricoes">Restrições</Link>
                                    </li>
                                    <li id="users_customer">
                                        <Link to="/academia/fichaTreino">Ficha Treino</Link>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li>
                            <div className="collapsible-header waves-effect">Gerenciamento</div>
                            <div className="collapsible-body">
                                <ul>
                                    <li id="users_seller">
                                        <Link to="/academia/funcionario">Funcionário</Link>
                                    </li>
                                    <li id="users_customer">
                                        <Link to="/academia/matricula">Matrícula</Link>
                                    </li>
                                    <li>
                                        <Link to="/academia/planos">Planos</Link>
                                    </li>
                                    <li id="users_customer">
                                        <Link to="/academia/atividadeAvaliacao">Atividade/Avaliação</Link>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>

                </ul>

                <header>
                    <ul className="dropdown-content" id="user_dropdown">
                        <li><a className="red-text text-lighten-2">Meu Cadastro</a></li>
                        <li><Link className="red-text text-lighten-2" to="/academia/logout">Logout</Link></li>
                    </ul>

                    <nav className="red lighten-2" role="navigation">
                        <div className="nav-wrapper">
                            <a data-activates="slide-out" className="button-collapse"><i className="material-icons">menu</i></a>

                            <ul className="right hide-on-med-and-down">
                                <li>
                                    <a className='right dropdown-button' data-activates='user_dropdown'><i className=' material-icons'>account_circle</i></a>
                                </li>
                            </ul>

                            <a data-activates="slide-out" className="button-collapse"><i className="mdi-navigation-menu"></i></a>
                        </div>
                    </nav>
                </header>
            </div>
        );
    }
}
