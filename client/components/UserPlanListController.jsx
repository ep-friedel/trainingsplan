import React from 'react';
import UserPlanList from './UserPlanList.jsx';

export default class UserPlanListController extends React.Component {
    constructor(props) {
        super();

        this.state = {
            plans: [],
            currentPlan: -1,
            initialized: false
        }
    }

    componentDidMount() {
        fetch(`/api/userplans`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            method: "GET"
        })
        .then(res => res.json())
        .then((userPlans) => {
            this.setState({
                plans: userPlans.filter(plan => plan.active),
                initialized: true
            });
        })
        .catch((err) => {
            console.log(err);
        });
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

    render() {
        if (this.state.initialized) {
            return (
                <UserPlanList
                    plans={this.state.plans}
                    show={this.props.show}
                    currentPlan={this.state.currentPlan}
                    setPlan={(id) => this.setPlan(id)} />
            )
        }
        return (<div className="row margin-top">
                <span className="fa fa-fw fa-cog slow-spin fa-3x" />
            </div>);
    }
}