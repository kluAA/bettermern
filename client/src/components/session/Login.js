import React from 'react';
import { Mutation } from "react-apollo";
import Mutations from "../../graphql/mutations";
const { LOGIN_USER } = Mutations;

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: ""
        };
    }

    update(field) {
        return e => this.setState({ [field]: e.target.value });
    }

    updateCache(client, { data }) {
        console.log(data);
        client.writeData({
            data: { isLoggedIn: data.login.loggedIn }
        });
    }

    render() {
        return (
            <Mutation
                mutation={LOGIN_USER}
                onCompleted={data => {
                    const { token } = data.login;
                    localStorage.setItem("auth-token", token);
                    this.props.history.push("/");
                }}
                update={(client, data) => this.updateCache(client, data)}
            >
                {loginUser => (
                    <div>
                        <form
                            onSubmit={e => {
                                e.preventDefault();
                                loginUser({
                                    variables: {
                                        email: this.state.email,
                                        password: this.state.password
                                    }
                                }).catch(err => console.log(err));
                            }}
                        >
													<>Login</>
                            <input
                                value={this.state.email}
                                onChange={this.update("email")}
                                placeholder="Email"
                            />
                            <input
                                value={this.state.password}
                                onChange={this.update("password")}
                                type="password"
                                placeholder="Password"
                            />
                            <button type="submit">Login</button>
                        </form>
                    </div>
                )}
            </Mutation>
        );
    }
}

export default Login;