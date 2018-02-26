export default {
  isAuthenticated: state => !!state.user.token,
  isLogged: state => !!state.user._id,
  authStatus: state => state.status
}
