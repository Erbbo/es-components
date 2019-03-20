import React from 'react';
import PropTypes from 'prop-types';
import { noop, isNumber } from 'lodash';
import styled from 'styled-components';

import Icon from '../../base/icons/Icon';
import Button from '../../controls/buttons/Button';
import OutlineButton from '../../controls/buttons/OutlineButton';
import InputBase from '../../controls/textbox/InputText';
import screenReaderOnly from '../screenReaderOnly/screenReaderOnly';
import { useTheme } from '../../util/useTheme';

const IncrementerWrapper = styled.div`
  display: flex;
`;

const IncrementerTextbox = styled(InputBase)`
  margin: 0 10px;
  text-align: center;
  width: 60px;
`;

function determineIsDisabled(threshold, newValue) {
  return isNumber(threshold) && newValue === threshold;
}

function updateCountReducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {
        count: state.count + action.amount
      };
    case 'decrement':
      return {
        count: state.count - action.amount
      };
    default:
  }
  return null;
}

const ScreenReaderButtonText = screenReaderOnly('span');

function Incrementer(props) {
  const theme = useTheme();

  const [state, dispatch] = React.useReducer(updateCountReducer, {
    count: props.startingValue
  });
  const isIncrementDisabled = determineIsDisabled(
    props.upperThreshold,
    state.count
  );
  const isDecrementDisabled = determineIsDisabled(
    props.lowerThreshold,
    state.count
  );

  React.useEffect(() => {
    props.onValueUpdated(state.count);
  });

  function decrementValue() {
    dispatch({ type: 'decrement', amount: props.decrementAmount });
  }

  function incrementValue() {
    dispatch({ type: 'increment', amount: props.incrementAmount });
  }

  const RenderedButton = props.useOutlineButton ? OutlineButton : Button;

  return (
    <IncrementerWrapper>
      <RenderedButton
        styleType="primary"
        onClick={decrementValue}
        disabled={isDecrementDisabled}
      >
        <ScreenReaderButtonText>
          Decrement value by
          {props.decrementAmount}
        </ScreenReaderButtonText>
        <Icon name="minus" />
      </RenderedButton>
      <IncrementerTextbox
        {...theme.validationInputColor.default}
        type="text"
        value={state.count}
        readOnly
      />
      <RenderedButton
        styleType="primary"
        onClick={incrementValue}
        disabled={isIncrementDisabled}
      >
        <ScreenReaderButtonText>
          Increment value by
          {props.incrementAmount}
        </ScreenReaderButtonText>
        <Icon name="add" />
      </RenderedButton>
    </IncrementerWrapper>
  );
}

Incrementer.propTypes = {
  /** The value to start the incrementer at */
  startingValue: PropTypes.number,
  /** The amount to increment the value by */
  incrementAmount: PropTypes.number,
  /** The amount to decrement the value by */
  decrementAmount: PropTypes.number,
  /** The highest value the incrementer can be incremented to */
  upperThreshold: PropTypes.number,
  /** The lowest value the incrementer can be decremented to */
  lowerThreshold: PropTypes.number,
  /** Use outline button styles */
  useOutlineButton: PropTypes.bool,
  /** Function to execute with the new value */
  onValueUpdated: PropTypes.func
};

Incrementer.defaultProps = {
  startingValue: 0,
  incrementAmount: 1,
  decrementAmount: 1,
  onValueUpdated: noop,
  upperThreshold: null,
  lowerThreshold: null,
  useOutlineButton: false
};

export default Incrementer;
