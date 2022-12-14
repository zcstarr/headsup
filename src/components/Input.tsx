import styled from "styled-components";
import { ThemeProp } from "./types";

const Input = styled.input`
background-color: ${({theme}: ThemeProp)=>theme.colors.button};
font-size: 1.3rem;
width: 220px;
height: 100px;
border: 4px;
border-radius: 4px;
border-style: solid;
`

export const CommonInput = styled.input.attrs({
  focus: "none",
})`
background-color: ${({theme}: ThemeProp)=>theme.colors.gray};
font-size: 1.3rem;
width: 470px;
height: 70px;
border: 4px;
border-radius: 4px;
border-style: none;
padding: 10px;
`

export const CommonTextArea = styled.textarea.attrs({
  focus: "none",
})`
background-color: ${({theme}: ThemeProp)=>theme.colors.gray};
font-size: 1.3rem;
width: 470px;
height: 200px;
border: 4px;
border-radius: 4px;
border-style: none;
padding: 10px;
`

export const InputLabel= styled.span`
  font-size: 1.3rem;
  font-weight: 400;
  margin-bottom: 10px;
`

export const EmailInput = styled.input.attrs({
  type: "email",
  focus: "none",
  placeholder:"What's your email address?"
})
`
 border: 6px solid ${({ theme }: ThemeProp) => theme.colors.primary};
 border-radius: 100px;
 height: 80px;
 background-color: white;
 padding: 20px;
 
::placeholder {
  text-align: center; 
  font-size: 1.2rem;
}

input:focus {
  text-align: left; 
  outline: none;
}
`;

export default Input