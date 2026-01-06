import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  journey: {},
};

const journey = createSlice({
  name: "journey",
  initialState,
  reducers: {
    setJourney: (state, { payload }) => {
      console.log(payload, "pay");

      state.journey = payload;
    },
  },
});
export const { setJourney } = journey.actions;
export default journey.reducer;
