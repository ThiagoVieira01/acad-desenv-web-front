import React, {Component} from 'react';
import $ from 'jquery';
import 'materialize-css';
import 'materialize-css/dist/css/materialize.min.css';
import Header from "./componentes/Header";

class App extends Component {

    componentDidMount() {
        $(".button-collapse").sideNav({
            closeOnClick: true
        });
        $('.collapsible').collapsible();
    }

    render() {
        return (
            <div className="row">
                <Header/>

                <main className="main">
                    {this.props.children}
                </main>
            </div>
        );
    }
}

export default App;
