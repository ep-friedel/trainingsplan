import React from 'react';

export default class DataInput extends React.Component {
    constructor(props) {
        super();

        this.state = {
            array: [{key: '', val: ''}],
            virgin: true
        }
    }

    addRow() {
        this.setState({
            array: this.state.array.concat([{key: '', val: ''}])
        });
    }

    updateValue(evt) {
        let newArr = this.state.array.slice(),
            index = evt.target.dataset.index,
            key = evt.target.dataset.type;

        newArr[index][key] = evt.target.value;

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

    render() {
        let pairs;

        pairs = this.state.array.map( (obj, index) => {
            return (
                <div className="row">
                    <input type="text" data-index={index} data-type="key" defaultValue={obj.key} onChange={evt => this.updateValue(evt)}/>
                    <input type="text" data-index={index} data-type="val" defaultValue={obj.val} onChange={evt => this.updateValue(evt)}/>
                </div>
            );
        });

        return (
            <div className={(this.props.className ? this.props.className : '') + ' column'} >
                <h3>{(this.props.title ? this.props.title : '')}</h3>
                {pairs}
                <div className="column">
                    <div className="row">
                        <h3>Neue Zeile hinzufügen:</h3>
                        <button className="fa fa-plus-circle" onClick={() => this.addRow()}></button>
                    </div>
                </div>
            </div>
        )
    }
}