import React from 'react';
import Dialog from './Dialog.jsx';

const planOptions = [
    {
        planId: 'Plan1',
        planName: 'Trainingsplan Nummer 1',
        planNotes: 'Fokus unterer Rücken',
        lastCompletion: 17358
    }, {
        planId: 'Plan2',
        planName: 'Trainingsplan Nummer 2',
        planNotes: 'Fokus Brust',
        lastCompletion: 17357
    }, {
        planId: 'Plan3',
        planName: 'Trainingsplan Nummer 3',
        planNotes: 'Fokus Beine',
        lastCompletion: 17352
    }
];

export default class LoginController extends React.Component {
    constructor(props) {
        super();
        this.state = {
            dialogOptions: {
                showDialog: true,
                hideClose: true,
                text: '',
                content: null,
                title: 'Logindialog',
                buttons: []
            }
        }
    }

    componentDidMount() {
        this.loadingScreen('Überprüfung der gespeicherten Login-Daten.');

        //fetch('/api/userData')
        new Promise((res, rej) => setTimeout(rej, 1000))
        // .then(res => res.json)
        .then(this.props.setOptions)
        .catch(() => this.requestLogin())
    }

    requestLogin() {
        this.setState(Object.assign({}, this.state, {
                dialogOptions: Object.assign({}, this.state.dialogOptions, {
                    text: 'Bitte geben Sie Ihre Login-Daten ein:',
                    content: this.renderLogin(),
                buttons: [{
                    name: "Anmelden",
                    click: () => this.tryLogin()
                }]
                })
            }
        ));
    }

    loadingScreen(text) {
        this.setState(Object.assign({}, this.state, {
                dialogOptions: Object.assign({}, this.state.dialogOptions, {
                    text,
                    content: (<div className="row margin-top"><span className="fa fa-fw fa-cog slow-spin fa-3x" /></div>),
                    buttons: []
                })
            }
        ));
    }

    tryLogin() {
        this.loadingScreen('Überprüfung der Login-Daten.');

        new Promise((res, rej) => setTimeout(res, 1000))
        // fetch('api/login', {})
        .then(() => {
            this.props.setOptions({
                user: {
                    name: 'Fochlac',
                    id: '001',
                    rank: 'Admin'
                },
                plans: planOptions,
                login: true
            });
        })
        .catch(() => this.requestLogin());
    }

    renderLogin() {
        return (
            <div className="column wrapper">
                <div className="row margin-top space-between flex-wrap">
                    <label htmlFor="user">Nutzer:</label>
                    <input type="text" id="user" onKeyPress={(evt) => ((evt.keyCode = '13') ? document.getElementById('pass').focus() : null)}/>
                </div>
                <div className="row margin-top margin-bottom space-between flex-wrap">
                    <label htmlFor="pass">Passwort:</label>
                    <input type="password" id="pass" onKeyPress={(evt) => ((evt.keyCode = '13') ? this.tryLogin() : null)}/>
                </div>
            </div>
        );
    }

    render() {
        return <Dialog opts={this.state.dialogOptions} />
    }
}