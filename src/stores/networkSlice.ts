import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NetworkState {
  manualStatus: 'online' | 'offline';
}

const initialState: NetworkState = {
  manualStatus: 'online',
};

const networkSlice = createSlice({
  name: 'network',
  initialState,
  reducers: {
    setManualStatus(state, action: PayloadAction<'online' | 'offline'>) {
      state.manualStatus = action.payload;
    },
  },
});

export const { setManualStatus } = networkSlice.actions;
export default networkSlice.reducer;
