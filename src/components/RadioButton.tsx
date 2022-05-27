import styled, { css } from "styled-components"

interface RadioButtonProps {
  isSelected?: boolean
}

const RadioButton = styled.button<RadioButtonProps>`
  width: auto;
  height: auto;
  position: relative;
  display: inline-block;
  padding: 10px;
  border-radius: 21px;
  border: solid 1px transparent;

  font-size: 16px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 22px;
  letter-spacing: normal;
  color: #ffffff;

  ${({ isSelected }) =>
    isSelected &&
    css`
      border-color: #ffffff;
    `}

  &::before {
    content: "";
    display: inline-block;
    width: 22px;
    height: 22px;
    vertical-align: top;

    border-radius: 50%;
    background-color: #ffffff;

    border: 3px solid #ffffff;

    margin-right: 7px;
    box-sizing: border-box;
    font-size: 0;
    line-height: 1;

    ${({ isSelected }) =>
      isSelected &&
      css`
        background-color: #0222ba;
      `}
  }
`

export default RadioButton
