import React from 'react';
import PlanList from './PlanList.jsx';
import Topbar from './Topbar.jsx';
import LoginController from './LoginController.jsx';
import '../css/General.css';

export default class App extends React.Component {
    constructor(props) {
        super();

        this.state = {
            user: undefined,
            plans: [],
            login: false,
            currentPlan: -1
        }
    }

    setPlan(id) {
       this.setState({currentPlan: id});
    }

    setOptions(options) {
        this.setState(options);
    }

    render() {
        return (
            <div className="appRoot">
                <Topbar opts={{hideTopbar: false}} setPlan={(id) => this.setPlan(id)}/>
                {this.state.login ? <PlanList userId={this.state.user.id} show={true} currentPlan={this.state.currentPlan} plans={this.state.plans} setPlan={(id) => this.setPlan(id)}/> : null}
                {!this.state.login ? <LoginController setOptions={(opts) => this.setOptions(opts)} /> : null}
            </div>
        );
    }
}