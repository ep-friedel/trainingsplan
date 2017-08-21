import React from 'react';
import Dialog from './Dialog.jsx';
import UserPlanEditor from './UserPlanEditor.jsx';

export default class UserPlanEditorController extends React.Component {
    constructor(props) {
        super();
        let settings = {
                note: '',
            };

        this.state = {
            settings: settings,
            dialogOptions: {
                showDialog: false,
                hideClose: true,
                text: 'Senden...',
                content: null,
                title: 'Daten übertragen',
                buttons: []
            },
            plan: props.plan,
            initialized: false
        };
    }

    componentDidMount() {
        fetch(`/api/plan/${this.props.plan.planId}/full`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            method: "GET"
        })
        .then(res => res.json())
        .then((template) => {
            this.setState({
                initialized: true,
                template: template
            });
        })
        .catch((err) => {
            console.log(err);
        });
    }


    handleSubmit() {
        fetch(`/api/${this.props.planId}/`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            method: "POST",
            body: JSON.stringify({
                machine: this.state.settings.machine,
                name: this.state.settings.name,
                note: this.state.settings.note,
                imageUrl: this.state.settings.imageUrl,
                setup: this.state.settings.setup,
                id: (this.state.settings.id ? this.state.settings.id : undefined)
            })
        })
        .then(() => {
            this.setState({ dialogOptions: Object.assign({}, this.state.dialogOptions, {showDialog: false})});
            if (this.props.submitCallback) {
                this.props.submitCallback(this.state.settings);
            }
        })
        .catch((err) => {
            console.log(err);
            this.setState({dialogOptions: Object.assign({}, this.state.dialogOptions, {showDialog: false})});
        });
    }

    setProperty(key, value) {
        let newObj = Object.assign({}, this.state.settings);

        newObj[key] = value;

        this.setState({settings: newObj});
    }

    render() {
        if (this.state.initialized) {
            return (<div className="padding">
                <Dialog opts={this.state.dialogOptions}>
                    <div className="row margin-top">
                        <span className="fa fa-fw fa-cog slow-spin fa-3x" />
                    </div>
                </Dialog>
                <UserPlanEditor template={this.state.template} plan={this.state.plan} ></UserPlanEditor>
                <button className="fullWidthButton">Speichern</button>
            </div>);
        }
        return (<div className="row margin-top">
                <span className="fa fa-fw fa-cog slow-spin fa-3x" />
            </div>);

    }
}