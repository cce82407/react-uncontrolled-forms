
const { Component } = React;
const { render } = ReactDOM;
//const { Route, HashRouter, Link, Switch, Redirect } = ReactRouterDOM;


const API = 'https://acme-users-api-rev.herokuapp.com/api';

    const fetchUser = async ()=> {
      const storage = window.localStorage;
      const userId = storage.getItem('userId'); 
      if(userId){
        try {
          return (await axios.get(`${API}/users/detail/${userId}`)).data;
        }
        catch(ex){
          storage.removeItem('userId');
          return fetchUser();
        }
      }
      const user = (await axios.get(`${API}/users/random`)).data;
      storage.setItem('userId', user.id);
      return  user;
    };

     

  

    class App extends Component {
        constructor(){
            super()
            this.state = {
                companies: [],
                user: {},
                following: []
            }
        }
        async componentDidMount(){
            const user = await fetchUser()
            const companies = (await axios.get(`${API}/companies`)).data
            const following = (await axios.get( `${API}/users/${user.id}/followingCompanies`)).data
            
            this.setState({ companies, user, following })
        }

        isFollowing = (id) => {
          //console.log(id)
          const { following } = this.state
          //console.log(following)
          //console.log(following.some(company => company.id === id))
          return following.some(followingCompany => followingCompany.companyId === id)
        }

        getRating = (id) => {
          const { following } = this.state
          //console.log(following.find(followingCompany => followingCompany.companyId === id)
          //)
          const beingFollowed =  following.find(followingCompany => followingCompany.companyId === id)
          return beingFollowed ? beingFollowed.rating : 0
        }

        render(){
            const { companies, following } = this.state
            return (
              <ul>
               { companies.map(company => <li className = { this.isFollowing(company.id) ? 'selected' : ''} key = { company.id }>
                 
                 { company.name }
                  <select value = {this.getRating(company.id)} onChange = { (e) => {
                   company.rating = e.target.value
                    this.setState({following: [...following,company]})
                    console.log(this.state)
                  }} >
                   <option>0</option>
                   <option>1</option>
                   <option>2</option>
                   <option>3</option>
                   <option>4</option>
                   <option>5</option>
                  </select>
                 </li>)}

              </ul>
            )
              
        }
    }
    
const root = document.querySelector('#root');
render(<App />, root)