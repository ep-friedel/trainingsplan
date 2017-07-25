import React from 'react';

export default class menu extends React.Component {
    constructor(props) {
        super();
        this.state ={
            open: false
        };


    }

    _handleDocumentClick(evt) {
        if (!event.path.filter(elem => (elem.classList && elem.classList.contains('menu'))).length) {
            this.setState({open: !this.state.open});
            document.querySelector('html').removeEventListener('click', this._handleDocumentClickBind);
        }
    }

    toggleMenu() {
        this.setState({open: !this.state.open});
        if (!this.state.open) {
            this._handleDocumentClickBind = this._handleDocumentClick.bind(this)
            document.querySelector('html').addEventListener('click', this._handleDocumentClickBind);
        } else {
            document.querySelector('html').removeEventListener('click', this._handleDocumentClickBind);
        }
    }

    renderMenuEntry(opt) {
        return React.createElement(
            'li',
            {
                onClick: () => opt.action(),
                className: 'pointer'
            },
            React.createElement(
                'span',
                {className: 'fa margin-right ' + opt.iconClass}
            ),
            React.createElement(
                'span',
                null,
                opt.text
            )
        )
    }


    render() {
        if (!this.props.showMenu) {
            return null;
        }


        return React.createElement(
            'div',
            {className: 'menu ' + (this.state.open ? 'open' : '') },
            (true ? React.createElement(
                'span',
                {
                    className: 'menuName pointer',
                    onClick: () => this.toggleMenu()
                },
                null,
                'Menu'
            ) : null),
            React.createElement(
                'span',
                {
                    className: 'fa fa-bars fa-lg menuButton pointer',
                    onClick: () => this.toggleMenu()
                }
            ),
            React.createElement(
                'ul',
                {className: 'menuList'},
                this.renderMenuEntry({
                    iconClass: 'fa-cog fa-lg',
                    action: () => {
                        this.toggleMenu();
                    },
                    text: 'Einstellungen'
                }),
                this.renderMenuEntry({
                    iconClass: 'fa-user fa-lg',
                    action: () => {
                        this.toggleMenu();
                    },
                    text: 'Profil'
                }),
                this.renderMenuEntry({
                    iconClass: 'fa-list fa-lg',
                    action: () => {
                        this.props.setPlan(-1);
                        this.toggleMenu();
                    },
                    text: 'Trainingspläne'
                }),
                this.renderMenuEntry({
                    iconClass: 'fa-sign-out fa-lg',
                    action: () => {
                        this.props.setOptions({
                            user: {},
                            plans: [],
                            login: false,
                            currentPlan: -1
                        });
                        this.toggleMenu();
                    },
                    text: 'Abmelden'
                })
            )
        );
    }
}