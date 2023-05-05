import { Gastype } from "@/types/tankstellen-types";
import { Dispatch, SetStateAction, useState } from 'react';

type Props = {
  setGasType: Dispatch<SetStateAction<"e10" | "e5" | "diesel">>
  gasType: Gastype
}


function GasTypeSelector({ setGasType, gasType }: Props) {

  return (
    <form>
      <fieldset>
        <legend>
         What Type of fuel your are using?
        </legend>

        <select
          value={gasType}
          onChange={event => {
            setGasType(event.target.value as Gastype)
          }}
        >
          <option value="e5">
            Super E5
          </option>
          <option value="e10">
            Super E10
          </option>
          <option value="diesel">
            Diesel
          </option>
        </select>
      </fieldset>
    </form>

  )
}



export default GasTypeSelector;
