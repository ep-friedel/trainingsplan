import React from 'react';

export default class DataInput extends React.Component {
    constructor(props) {
        super();

        this.state = {
            array: ( props.array ? props.array.map(obj => Object.assign({}, obj)) : [{key: '', val: ''}]),
            virgin: true
        }
    }

    addRow() {
        this.setState({
            array: this.state.array.concat({key: '', val: ''})
        });
    }

    delay(evt) {
        let e = evt.target;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => this.updateValue(e), 200);
    }

    updateValue(target) {
        let newArr = this.state.array.slice(),
            index = target.dataset.index,
            key = target.dataset.type;

        newArr[index][key] = target.value;

        this.setState({
            array: newArr,
            virgin: false
        });

        this.props.output(this.state.array.reduce((acc, obj) => {
            if (obj.key.length) {
                acc[obj.key] = obj.val;
            }
            return acc;
        }, {}));
    }

    renderInput(type, defaultValue, index, dataType, options) {
        if (type === 'text' || type === 'number') {
            return <input type="{type}" className="maxWidth45 width45" data-index={index} data-type={dataType} defaultValue={defaultValue} onChange={evt => this.delay(evt)}/>;
        } else if (type === 'select') {
            return (
                <select className="maxWidth45 width45" data-index={index} data-type={dataType} onChange={evt => this.updateValue(evt.target)}>
                    <option value="">Bitte auswählen</option>
                    {options.map(option => <option value={option.value} selected={(option.value === defaultValue) ? 'selected' : ''}>{option.name}</option>)}
                </select>
            );
        }
    }

    render() {
        let pairs;

        pairs = this.state.array.map( (obj, index) => {
            return (
                <div className="row margin-top">
                    {this.renderInput(this.props.col1type, obj.key, index, 'key', this.props.col1options)}
                    {this.renderInput(this.props.col2type, obj.val, index, 'val', this.props.col2options)}
                </div>
            );
        });

        return (
            <div className={(this.props.className ? this.props.className : '') + ' column margin-bottom'} >
                {(this.props.title ? <h3>this.props.title</h3> : null)}
                <div className="row margin-top">
                    <h3>{this.props.titleCol1}</h3>
                    <h3>{this.props.titleCol2}</h3>
                </div>
                {pairs}
                {
                    (this.props.limit > this.state.array.length) ?
                        (
                            <div className="column">
                                <div className="row margin-top">
                                    <h3>Neue Zeile hinzufügen:</h3>
                                    <label className="fa fa-plus-circle labelButton fa-lg" onClick={() => this.addRow()}></label>
                                </div>
                            </div>
                        ) : null
                }
            </div>
        )
    }
}