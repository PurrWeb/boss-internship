import styled from 'styled-components';

const ModalWrapper = styled.div`
  position: fixed;
  border: 1px solid #ccc;
  width: 200px;
  top: 20px;
  right: 20px;
  background-color: ${props => props.primary ? 'red' : '#FFF'};
  padding: 20px;
  text-align: center;
`
export default ModalWrapper;