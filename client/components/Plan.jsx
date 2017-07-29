import React from 'react';
import Dialog from './Dialog.jsx';
import Exercise from './Exercise.jsx';

export default class Plan extends React.Component {
    constructor(props) {
        super();

        this.state = {
            dialogOptions: {
                showDialog: false
            }
        }
    }

    openModal(opts) {
        this.setState({
            dialogOptions: {
                showDialog: true,
                text: opts.text ? opts.text : '',
                title: opts.title ? opts.title : '',
                buttons: opts.buttons ? opts.buttons : [{
                    name: "Schließen",
                    click: () => this.closeModal()
                }]
            }
        });
    }

    closeModal() {
        this.setState({
            dialogOptions: {
                showDialog: false
            }
        });
    }

    render() {
        let ex,
            exerciseList = [];

        switch(this.props.mode) {
            case 'hidden':
                return null;

            case 'updating':
                return (
                    <div className="exerciseList loading">
                        <span className="fa fa-cog fa-spin fa-5x fa-fw" />
                        <h3>Lade Trainingsplan</h3>
                    </div>
                );

            case 'minimized':
                return (
                    <div className="row" onClick={() => this.props.toggleMinimized()}>
                        <span className="fa fa-list-alt planIcon" />
                        <div>
                            <h3>{this.props.planName}</h3>
                            <p>{this.props.planNotes}</p>
                        </div>
                    </div>
                );

            case 'full':
                for (ex in this.props.exercises) {
                    exerciseList.push(React.createElement(
                        Exercise,
                        {
                            details: this.props.exercises[ex].details,
                            pastResults: this.props.exercises[ex].pastResults,
                            key: ex,
                            dataId: ex,
                            setExercise: this.props.setExercise,
                            display: (this.props.currentExercise === -1) ? 'minified' : (this.props.currentExercise == ex) ? 'full' : 'hidden',
                            openModal: (opts) => this.openModal(opts),
                            closeModal: () => this.closeModal(),
                            saveNewResults: this.props.saveNewResults,

                        }
                    ));
                }

                return (<div className="wrapper">
                    <div className={"exerciseList" + (this.state.hideAll ? '' : ' minimized')}>
                        {exerciseList}
                    </div>
                    <Dialog opts={this.state.dialogOptions} close={() => this.closeModal()} />
                    {(this.props.currentExercise === -1) ? <button className="fullWidthButton" onClick={this.props.toggleMinimized}>Trainingsplan schließen</button> : null}
                </div>);
        }

    }
}