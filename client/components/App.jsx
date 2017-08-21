import React from 'react';
import Topbar from './Topbar.jsx';
import LoginController from './LoginController.jsx';
import Dashboard from './Dashboard.jsx';
import '../css/General.css';

export default class App extends React.Component {
    constructor(props) {
        super();

        this.state = {
            user: undefined,
            plans: [],
            login: false,
            currentPlan: -1,
            activeDashboardPage: ''
        }
    }

    setPlan(id) {
        this.setState({currentPlan: id});
    }

    savePlan(index, plan) {
        let newArr = this.state.plans.slice();

        newArr[index] = plan;
        this.setState({plans: newArr});
    }

    setOptions(options) {
        this.setState(options);
    }

    openDashboardPage(page) {
        this.setState({
            activeDashboardPage: page
        });
    }

    render() {
        return (
            <div className="appRoot">
                <Topbar opts={{hideTopbar: false}} setPlan={(id) => this.setPlan(id)} openHome={() => this.openDashboardPage('')} setOptions={(opts) => this.setOptions(opts)}/>
                {this.state.login ?
                    <Dashboard options={
                        {
                            user: this.state.user,
                            currentPlan: this.state.currentPlan,
                            plans: this.state.plans
                        }
                    } setPlan={(id) => this.setPlan(id)} savePlan={(index, plan) => this.savePlan(index, plan)} activePage={this.state.activeDashboardPage} openPage={(arg) => this.openDashboardPage(arg)}/>
                    : null
                }
                {!this.state.login ? <LoginController setOptions={(opts) => this.setOptions(opts)} /> : null}
            </div>
        );
    }
}