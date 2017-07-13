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

const   dom = document.querySelector.bind(document),
        salt= 'This is my awesome Client Side Salt and so on.';


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

    generateHashKey(source) {
        return window.crypto.subtle.importKey(
            "raw",
            new TextEncoder().encode(source),
            {"name": "PBKDF2"},
            false,
            ["deriveKey"]
        ).then(baseKey => {
            return window.crypto.subtle.deriveKey(
                    {
                        "name": "PBKDF2",
                        "salt": new TextEncoder().encode(salt),
                        "iterations": 100,
                        "hash": "SHA-256"
                    },
                    baseKey,
                    {"name": "AES-CBC", "length": 128},
                    true,
                    ["encrypt", "decrypt"]
                );
        }).then(aesKey => {
            return window.crypto.subtle.exportKey("jwk", aesKey);
        });
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
        const   user = dom('#user').value,
                pass = dom('#pass').value;

        this.loadingScreen('Überprüfung der Login-Daten.');

        this.generateHashKey(pass)
        .then((hash) => {
            return fetch('api/authentication', {
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({
                    user,
                    hash
                })
            })
        })
        .then(res => Promise[(res.status > 400) ? 'reject' : 'resolve'](res))
        .then(res => res.json())
        .then((data) => {
            this.props.setOptions({
                user: {
                    name: data.user.name,
                    id: data.user.id,
                    role: data.user.role
                },
                plans: data.plans,
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