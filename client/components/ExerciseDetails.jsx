import React from 'react';

export default class details extends React.Component {
    constructor(props) {
        super();
    }

    render() {
        let propertyname,
            setup = [];

        for (propertyname in this.props.details.setup) {
            setup.push(this.renderProperty(propertyname, this.props.details.setup[propertyname]));
        }

        return React.createElement(
            'div',
            {className: "detailsWrapper"},
            (this.props.details.note ? React.createElement(
                'h4',
                null,
                'Hinweis:'
            ) : null),
            (this.props.details.note ? React.createElement(
                'p',
                {className: 'note'},
                this.props.details.note
            ) : null),
            React.createElement(
                'h4',
                null,
                'Einstellungen'
            ),
            React.createElement(
                'ul',
                {className: "setup"},
                setup
            )
        );
    }

    renderProperty(name, value) {
        return React.createElement(
            'li',
            {key: name},
            React.createElement(
                'span',
                null,
                name + ':'
            ),
            React.createElement(
                'span',
                null,
                value
            )
        );
    }
}