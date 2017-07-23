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
            },
            register: {},
            dialogType: 'loading'
        }
    }

    componentDidMount() {
        this.loadingScreen('Überprüfung der gespeicherten Login-Daten.');
        fetch('/api/user/self', {
            mode: 'same-origin',
            credentials: 'include'
        })
        .then(res => Promise[(res.status >= 400) ? 'reject' : 'resolve'](res))
        .then(res => res.json())
        .then((data) => {
            this.props.setOptions({
                user: {
                    name: data.name,
                    id: data.id,
                    role: data.role
                },
                plans: [],
                login: true
            })
        })
        .catch((err) => {
            console.log(err);
            this.requestLogin();
        });
    }

    generateHash(source) {
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
            return window.crypto.subtle.exportKey("raw", aesKey);
        }).then(rawKey => {
            return btoa(new Uint8Array(rawKey).reduce((data, byte) => data + String.fromCharCode(byte), '')).replace('==', '');
        });
    }

    requestLogin() {
        this.setState(Object.assign({}, this.state, {
                dialogOptions: Object.assign({}, this.state.dialogOptions, {
                    text: 'Bitte geben Sie Ihre Login-Daten ein:',
                    buttons: [{
                        name: "Anmelden",
                        click: () => this.tryLogin()
                    }]
                }),
                dialogType: 'login'
            }
        ));
    }

    requestRegister() {
        this.setState(Object.assign({}, this.state, {
                dialogOptions: Object.assign({}, this.state.dialogOptions, {
                    text: 'Bitte geben Sie Ihre Login-Daten ein:',
                    buttons: [{
                        name: "Registrieren",
                        click: () => this.tryRegister()
                    }]
                }),
                register: {},
                dialogType: 'register'
            }
        ));
    }

    loadingScreen(text) {
        this.setState(Object.assign({}, this.state, {
                dialogOptions: Object.assign({}, this.state.dialogOptions, {
                    text,
                    buttons: []
                }),
                dialogType: 'loading'
            }
        ));
    }

    setValidity(id, bool) {
        let newObj = {};

        newObj[id] = bool;

        this.setState(Object.assign({}, this.state, {
            register: Object.assign({}, this.state.register, newObj)
        }));
    }

    tryLogin() {
        const   user = dom('#user').value,
                pass = dom('#pass').value;

        this.loadingScreen('Überprüfung der Login-Daten.');


        this.generateHash(pass)
        .then((hash) => {
            return fetch('api/authentication', {
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                credentials: 'include',
                method: "POST",
                body: JSON.stringify({
                    user,
                    hash
                })
            });
        })
        .then(res => Promise[(res.status >= 400) ? 'reject' : 'resolve'](res))
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

    tryRegister() {
        const   user = dom('#user').value,
                pass = dom('#pass').value;

        if (this.state.register.pass && this.state.register.pass2) {
            this.loadingScreen('Registrierung');

            this.generateHash(pass)
            .then((hash) => {
                return fetch('api/registration', {
                    headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json'
                    },
                    method: "POST",
                    credentials: 'include',
                    body: JSON.stringify({
                        user,
                        hash
                    })
                });
            })
            .then(res => Promise[(res.status >= 400) ? 'reject' : 'resolve'](res))
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
            .catch(() => this.requestRegister());
        }
    }

    render() {
        switch(this.state.dialogType) {
            case 'register':
                return (
                    <Dialog opts={this.state.dialogOptions}>
                        <div className="column wrapper">
                            <div className="row margin-top space-between flex-wrap">
                                <label htmlFor="user">Nutzer:</label>
                                <div className="width100 row stretch alignCenter" >
                                    <input type="text" id="user" onKeyPress={(evt) => ((evt.keyCode = '13' && this.state.register.userValid) ? dom('#pass').focus() : null)} onChange={(evt) => this.setValidity('user', (/^[A-Za-z0-9\s]{5,50}$/.test(evt.currentTarget.value)))} />
                                    <span className={((this.state.register.user === true) ? 'fa-check validColor' : ((this.state.register.user === false) ? 'fa-times invalidColor' : '1')) + ' fa validityIconInside'}></span>
                                </div>
                            </div>
                            <div className="row margin-top space-between flex-wrap">
                                <label htmlFor="pass">Passwort:</label>
                                <div className="width100 row stretch alignCenter" >
                                    <input type="password" id="pass" onKeyPress={(evt) => ((evt.keyCode = '13' && this.state.register.passValid) ? dom('#pass2').focus() : null)}  onChange={(evt) => this.setValidity('pass', (/^[A-Za-z0-9\s.,-_#'+*!"§$&\/()="]{8,50}$/.test(evt.currentTarget.value)))} />
                                    <span className={((this.state.register.pass === true) ? 'fa-check validColor' : ((this.state.register.pass === false) ? 'fa-times invalidColor' : '1')) + ' fa validityIconInside'}></span>
                                </div>
                            </div>
                            <div className="row margin-top space-between flex-wrap">
                                <label htmlFor="pass2">Passwort wiederholen:</label>
                                <div className="width100 row stretch alignCenter" >
                                    <input type="password" id="pass" onKeyPress={(evt) => ((evt.keyCode = '13' && this.state.register.pass2Valid) ? this.tryRegisterr() : null)}  onChange={(evt) => this.setValidity('pass2', (evt.currentTarget.value === dom('#pass').value))} />
                                    <span className={((this.state.register.pass2 === true) ? 'fa-check validColor' : ((this.state.register.pass2 === false) ? 'fa-times invalidColor' : '1')) + ' fa validityIconInside'}></span>
                                </div>
                            </div>
                            <div className="margin-top">
                                <a className="pointer underline smallText" onClick={() => this.requestLogin()}>Zurück zur Anmeldung</a>
                            </div>
                        </div>
                    </Dialog>
                );

            case 'login':
                return (
                    <Dialog opts={this.state.dialogOptions}>
                        <div className="column wrapper">
                            <div className="row margin-top space-between flex-wrap">
                                <label htmlFor="user">Nutzer:</label>
                                <input className="width100" type="text" id="user" onKeyPress={(evt) => ((evt.keyCode === '13') ? dom('#pass').focus() : null)}/>
                            </div>
                            <div className="row margin-top space-between flex-wrap">
                                <label htmlFor="pass">Passwort:</label>
                                <input className="width100" type="password" id="pass" onKeyPress={(evt) => ((evt.keyCode === '13') ? this.tryLogin() : null)}/>
                            </div>
                            <div className="margin-top">
                                <a className="pointer underline smallText" onClick={() => this.requestRegister()}>Account erstellen</a>
                            </div>
                        </div>
                    </Dialog>
                );

            case 'loading':
                return (
                    <Dialog opts={this.state.dialogOptions}>
                        <div className="row margin-top">
                            <span className="fa fa-fw fa-cog slow-spin fa-3x" />
                        </div>
                    </Dialog>
                );
            default:
                return null;
        }
    }
}