import { useCallback, useEffect, useState } from "react";

export enum GeolocationMode {
  SINGLE = "single",
  WATCH = "watch"
}

type GeolocationCoordinates = {
  accuracy: number | null;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  latitude: number | null;
  longitude: number | null;
  speed: number | null;
};

type GeolocationResponse = {
  coords: GeolocationCoordinates;
  timestamp: number;
};

type GeolocationError = {};

type GeolocationConfig = {};

interface IPositionState {
  position: GeolocationResponse | null;
  positionError: GeolocationError | null;
  positionLoading: Boolean;
  previousPositions: Array<GeolocationResponse | null> | null;
}

const defaultGeolocationConfig: GeolocationConfig = {
  timeout: 12000,
  maximumAge: 60000,
  enableHighAccuracy: true
};

function useGeolocation(
  mode: GeolocationMode = GeolocationMode.SINGLE,
  stop: Boolean = false,
  config: GeolocationConfig
) {
  const [positionState, setPositionState] = useState<IPositionState>({
    position: null,
    positionError: null,
    positionLoading: true,
    previousPositions: []
  });

  const onGeolocationSuccess = useCallback(
    position => {
      if (!stop) {
        setPositionState(oldState => ({
          ...oldState,
          position,
          previousPositions:
            mode === GeolocationMode.SINGLE
              ? [oldState.position]
              : [
                  ...(oldState.previousPositions ? oldState.previousPositions : []),
                  oldState.position
                ]
        }));
      }
    },
    [setPositionState]
  );

  const onGeolocationError = useCallback(
    error => setPositionState(oldState => ({ ...oldState, error })),
    [setPositionState]
  );

  useEffect(() => {
    if (mode === GeolocationMode.SINGLE) {
      navigator.geolocation.getCurrentPosition(onGeolocationSuccess, onGeolocationError, config);
    } else if (mode === GeolocationMode.WATCH) {
      navigator.geolocation.watchPosition(onGeolocationSuccess, onGeolocationError, config);
    }
  }, [mode, stop]);

  return positionState;
}

export default useGeolocation;
