import { connect } from 'react-redux';
import oFetch from 'o-fetch';
import Shifts from '../components/shifts';


const mapStateToProps = state => {
  return {
    venues: state.get('venues'),
  };
};

const mapDispatchToProps = {
  
};

export default connect(mapStateToProps)(Shifts);